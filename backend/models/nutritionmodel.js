const mongoose = require('mongoose')

const Schema = mongoose.Schema

const nutritionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    food: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Nutrition', nutritionSchema)