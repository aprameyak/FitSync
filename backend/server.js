require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require("./routes/auth")
const fitnessRoutes = require("./routes/fitness")
const nutritionRoutes = require("./routes/nutrition")
const profileRoutes = require("./routes/profile")
const calorieRoutes = require("./routes/calories")
const mediaRoutes = require("./routes/media")
const liftRoutes = require("./routes/lift")
const auth = require('./middleware/auth');

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
app.use('/api/fitness', auth, fitnessRoutes)
app.use('/api/nutrition', auth, nutritionRoutes)
app.use('/api/profile', auth, profileRoutes)
app.use('/api/calories', auth, calorieRoutes)
app.use('/api/media', auth, mediaRoutes)
app.use('/api/lift', auth, liftRoutes)

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

if (!process.env.ATLAS_URI || !process.env.PORT || !process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    console.error("Error: Missing required environment variables");
    process.exit(1);
}

mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
