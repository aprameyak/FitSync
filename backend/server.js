require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');

const fitnessRoutes = require("./routes/fitness")
const nutritionRoutes = require("./routes/nutrition")
const profileRoutes = require("./routes/profile")
const calorieRoutes = require("./routes/calories")
const mediaRoutes = require("./routes/media")
const liftRoutes = require("./routes/lift")

const app = express();

app.use(cors());
app.use(express.json());

app.use('/fitness', fitnessRoutes)
app.use('/nutrition',nutritionRoutes)
app.use('/profile', profileRoutes)
app.use('/calories', calorieRoutes)
app.use('/media', mediaRoutes)
app.use('/lift', liftRoutes)

if (!process.env.ATLAS_URI || !process.env.PORT) {
  console.error("Error: Missing required environment variables ATLAS_URI or PORT");
  process.exit(1);
}

mongoose.connect(process.env.ATLAS_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    })
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });
