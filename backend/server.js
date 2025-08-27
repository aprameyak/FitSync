import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.js";
import fitnessRoutes from "./routes/fitness.js";
import nutritionRoutes from "./routes/nutrition.js";
import profileRoutes from "./routes/profile.js";
import calorieRoutes from "./routes/calories.js";
import mediaRoutes from "./routes/media.js";
import liftRoutes from "./routes/lift.js";
import auth from './middleware/auth.js';

// ES6 module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

const allowedOrigins = [
    'http://localhost:3000',
    'https://fitsync.vercel.app',
    'https://fitsync-frontend.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/fitness', auth, fitnessRoutes);
app.use('/api/nutrition', auth, nutritionRoutes);
app.use('/api/profile', auth, profileRoutes);
app.use('/api/calories', auth, calorieRoutes);
app.use('/api/media', auth, mediaRoutes);
app.use('/api/lift', auth, liftRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/out')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/out/index.html'));
    });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err 
    });
});

if (!process.env.DATABASE_URL || !process.env.PORT || !process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    console.error("Error: Missing required environment variables");
    console.error("Required: DATABASE_URL, PORT, JWT_SECRET, JWT_EXPIRES_IN");
    process.exit(1);
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    console.log('Database connection will be established when first request is made');
});
