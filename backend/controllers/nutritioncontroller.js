import NutritionModel from '../models/nutritionmodel.js';

const createNutrition = async (req, res) => {
    const { userId, foodName, calories, protein, carbs, fat, fiber, mealType, notes, date } = req.body;
    try {
        const nutrition = await NutritionModel.create({
            userId, 
            foodName, 
            calories, 
            protein, 
            carbs, 
            fat, 
            fiber, 
            mealType, 
            notes, 
            date: date || new Date()
        });
        res.status(201).json(nutrition);
    } catch(error) {    
        res.status(400).json({error: error.message});
    }
};

const getNutrition = async (req, res) => {
    const { id } = req.params;
    try {
        const nutrition = await NutritionModel.findById(id);
        if(!nutrition) {
            return res.status(404).json({error: "No such Nutrition"});
        }
        res.status(200).json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutrition', error: error.message });
    }
};

const deleteNutrition = async (req, res) => {
    const { id } = req.params;
    try {
        const nutrition = await NutritionModel.delete(id);
        if(!nutrition) {
            return res.status(404).json({error: "No such Nutrition"});
        }
        res.status(200).json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting nutrition', error: error.message });
    }
};

const updateNutrition = async (req, res) => {
    const { id } = req.params;
    try {
        const nutrition = await NutritionModel.update(id, req.body);
        if(!nutrition) {
            return res.status(404).json({error: "No such Nutrition"});
        }
        res.status(200).json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error updating nutrition', error: error.message });
    }
};

const getNutritions = async (req, res) => {
    const { userId } = req.params;  
    try {
        const nutrition = await NutritionModel.findByUserId(userId);
        res.status(200).json(nutrition);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutritions', error: error.message });
    }
};

const getNutritionStats = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    try {
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();
        
        const stats = await NutritionModel.getStats(userId, start, end);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutrition stats', error: error.message });
    }
};

export { 
    createNutrition, 
    getNutrition, 
    getNutritions, 
    deleteNutrition, 
    updateNutrition, 
    getNutritionStats 
};