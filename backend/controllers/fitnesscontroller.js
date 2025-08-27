import FitnessModel from '../models/fitnessmodel.js';

const createFitness = async (req, res) => {
    const { userId, type, duration, calories, notes, date } = req.body;
    try {
        const fitness = await FitnessModel.create({
            userId, 
            type, 
            duration, 
            calories, 
            notes, 
            date: date || new Date()
        });
        res.status(201).json(fitness);
    } catch(error) {    
        res.status(400).json({error: error.message});
    }
};

const getFitnesses = async (req, res) => {
    const { userId } = req.params;  
    try {
        const fitness = await FitnessModel.findByUserId(userId);
        res.status(200).json(fitness);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fitnesses', error: error.message });
    }
};

const getFitness = async (req, res) => {
    const { id } = req.params;
    try {
        const fitness = await FitnessModel.findById(id);
        if(!fitness) {
            return res.status(404).json({error: "No such fitness"});
        }
        res.status(200).json(fitness);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fitness', error: error.message });
    }
};

const deleteFitness = async (req, res) => {
    const { id } = req.params;
    try {
        const fitness = await FitnessModel.delete(id);
        if(!fitness) {
            return res.status(404).json({error: "No such fitness"});
        }
        res.status(200).json(fitness);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting fitness', error: error.message });
    }
};

const updateFitness = async (req, res) => {
    const { id } = req.params;
    try {
        const fitness = await FitnessModel.update(id, req.body);
        if(!fitness) {
            return res.status(404).json({error: "No such fitness"});
        }
        res.status(200).json(fitness);
    } catch (error) {
        res.status(500).json({ message: 'Error updating fitness', error: error.message });
    }
};

const getFitnessStats = async (req, res) => {
    const { userId } = req.params;
    try {
        const stats = await FitnessModel.getStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fitness stats', error: error.message });
    }
};

export { 
    createFitness, 
    getFitness, 
    getFitnesses, 
    deleteFitness, 
    updateFitness, 
    getFitnessStats 
};