const mongoose = require('mongoose')

const Schema = mongoose.Schema

const fitnessSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    exercise: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    pr: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Fitness', fitnessSchema)