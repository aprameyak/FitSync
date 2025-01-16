const Calories = require('../models/caloriesmodel');
const mongoose = require('mongoose');

const getCalories = async (req, res) => {
    const { userId } = req.params;

    try {
        const calories = await Calories.findOne({ userId });
        if (!calories) {
            return res.status(404).json({ error: 'Calories data not found' });
        }

        res.status(200).json(calories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching calories', details: error.message });
    }
};

const updateCalories = async (req, res) => {
    const { userId } = req.params;
    const { fitness, nutrition } = req.body;

    try {
        const updatedCalories = await Calories.findOneAndUpdate(
            { userId },
            { fitness, nutrition },
            { new: true, upsert: true } 
        );

        res.status(200).json(updatedCalories);
    } catch (error) {
        res.status(400).json({ error: 'Error updating calories', details: error.message });
    }
};

const createCalories = async (req, res) => {
    const { userId } = req.body;
    try {
        let calories = await Calories.findOne({ userId });
        if (!calories) {
            calories = await Calories.create({
                userId,
                fitness: 0,
                nutrition: 0,
            });
        }
        res.status(200).json(calories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCalories,
    updateCalories,
    createCalories,
};
