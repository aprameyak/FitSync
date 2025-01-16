const Nutrition = require('../models/nutritionmodel')
const mongoose = require('mongoose')

const createNutrition = async (req, res) => {
    const {userId, food, quantity, calories} = req.body
    try {
        const nutrition = await Nutrition.create({userId, food, quantity, calories})
        res.status(200).json(nutrition)
    } catch(error) {    
        res.status(400).json({error: error.message})
    }
}

const getNutrition = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({error: "No such Nutrition"})
    }
    const nutrition = await Nutrition.findById(id)
    if(!nutrition) {
        res.status(404).json({error: "No such Nutrition"})
    }
    res.status(200).json(nutrition)
}

const deleteNutrition = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({error: "No such Nutrition"})
    }
    const nutrition = await Nutrition.findOneAndDelete({_id: id})
    if(!nutrition) {
        res.status(404).json({error: "No such Nutrition"})
    }
    res.status(200).json(nutrition)
}

const updateNutrition = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({error: "No such Nutrition"})
    }
    const nutrition = await Nutrition.findOneAndUpdate({_id: id}, {...req.body})
    if(!nutrition) {
        res.status(404).json({error: "No such Nutrition"})
    }
    res.status(200).json(nutrition)
}

const getNutritions = async (req, res) => {
    const { userId } = req.params;  
    try {
        const nutrition = await Nutrition.find({ userId });
        if (!nutrition) {
            return res.status(404).json({ message: 'Nutrition not found' });
        }
        res.status(200).json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutritions', error: error.message });
    }
};

module.exports = {
    createNutrition,
    getNutrition,
    getNutritions,
    deleteNutrition,
    updateNutrition
}