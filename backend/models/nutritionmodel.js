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
    },
    protein: {
        type: Number,
        required: false,
        default: 0
    },
    carbs: {
        type: Number,
        required: false,
        default: 0
    },
    fat: {
        type: Number,
        required: false,
        default: 0
    },
    mealType: {
        type: String,
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Nutrition', nutritionSchema)