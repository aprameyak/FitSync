const mongoose = require('mongoose')

const Schema = mongoose.Schema

const profileSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    gender: {
        type: Number,
        required: true
    },
    activityLevel: {
        type: String,
        required: false,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very active']
    },
    goal: {
        type: String,
        required: false,
        enum: ['lose', 'maintain', 'gain']
    }
}, {timestamps: true})

module.exports = mongoose.model('Profile', profileSchema)