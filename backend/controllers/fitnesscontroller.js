const Fitness = require('../models/fitnessmodel')
const mongoose = require('mongoose')

const createFitness = async (req, res) => {
    const {userId, excercise, loadandreptitions, calories} = req.body
    try {
        const fitness = await Fitness.create({userId, excercise, loadandreptitions, calories})
        res.status(200).json(fitness)
    } catch(error) {    
        res.status(400).json({error: error.message})
    }
}

const getFitnesses = async (req, res) => {
    const { userId } = req.params;  
    try {
        const fitness = await Fitness.find({ userId });
        if (!fitness) {
            return res.status(404).json({ message: 'Fitness not found' });
        }
        res.status(200).json(fitness);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fitnesses', error: error.message });
    }
};

const getFitness = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({error: "No such fitness"})
    }
    const fitness = await Fitness.findById(id)
    if(!fitness) {
        res.status(404).json({error: "No such fitness"})
    }
    res.status(200).json(fitness)
}

const deleteFitness = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({error: "No such fitness"})
    }
    const fitness = await Fitness.findOneAndDelete({_id: id})
    if(!fitness) {
        res.status(404).json({error: "No such fitness"})
    }
    res.status(200).json(fitness)
}

const updateFitness = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({error: "No such fitness"})
    }
    const fitness = await Fitness.findOneAndUpdate({_id: id}, {...req.body})
    if(!fitness) {
        res.status(404).json({error: "No such fitness"})
    }
    res.status(200).json(fitness)
}

module.exports = {
    createFitness,
    getFitness,
    getFitnesses,
    deleteFitness,
    updateFitness
}