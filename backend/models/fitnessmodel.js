const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fitnessSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    excercise: {
        type: String,
        required: true
    },
    loadandreptitions: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Fitness', fitnessSchema)