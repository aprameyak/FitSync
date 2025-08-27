import CaloriesModel from '../models/caloriesmodel.js';

const getCalories = async (req, res) => {
    const { userId } = req.params;
    const { date } = req.query;
    
    try {
        let calories;
        if (date) {
            calories = await CaloriesModel.findByUserIdAndDate(userId, new Date(date));
        } else {
            calories = await CaloriesModel.findByUserId(userId);
        }
        
        if (!calories || (Array.isArray(calories) && calories.length === 0)) {
            return res.status(404).json({ error: 'Calories data not found' });
        }

        res.status(200).json(calories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching calories', details: error.message });
    }
};

const updateCalories = async (req, res) => {
    const { userId } = req.params;
    const { consumed, burned, net, goal, date } = req.body;

    try {
        const targetDate = date ? new Date(date) : new Date();
        const updatedCalories = await CaloriesModel.upsert(userId, targetDate, {
            consumed: consumed || 0,
            burned: burned || 0,
            net: net || 0,
            goal: goal
        });

        res.status(200).json(updatedCalories);
    } catch (error) {
        res.status(400).json({ error: 'Error updating calories', details: error.message });
    }
};

const createCalories = async (req, res) => {
    const { userId, consumed, burned, net, goal, date } = req.body;
    try {
        const targetDate = date ? new Date(date) : new Date();
        const calories = await CaloriesModel.create({
            userId,
            consumed: consumed || 0,
            burned: burned || 0,
            net: net || 0,
            goal: goal,
            date: targetDate
        });
        res.status(201).json(calories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCaloriesStats = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    try {
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();
        
        const stats = await CaloriesModel.getStats(userId, start, end);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching calories stats', details: error.message });
    }
};

export { 
    getCalories, 
    updateCalories, 
    createCalories, 
    getCaloriesStats 
};
