import LiftModel from '../models/liftmodel.js';

const getLifts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, exercise } = req.query;
        
        let lifts;
        if (startDate && endDate) {
            lifts = await LiftModel.findByUserIdAndDateRange(userId, new Date(startDate), new Date(endDate));
        } else if (exercise) {
            lifts = await LiftModel.findByExercise(userId, exercise);
        } else {
            lifts = await LiftModel.findByUserId(userId);
        }

        return res.status(200).json(lifts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving lifts' });
    }
};

const addLift = async (req, res) => {
    try {
        const { userId, exercise, sets, reps, weight, notes, date } = req.body;

        if (!userId || !exercise || !sets || !reps) {
            return res.status(400).json({ message: 'UserId, exercise, sets, and reps are required' });
        }

        const newLift = await LiftModel.create({
            userId,
            exercise,
            sets,
            reps,
            weight,
            notes,
            date: date || new Date()
        });

        return res.status(201).json(newLift);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding lift' });
    }
};

const deleteLift = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLift = await LiftModel.delete(id);

        if (!deletedLift) {
            return res.status(404).json({ message: 'Lift not found' });
        }

        return res.status(200).json({ message: 'Lift deleted successfully', lift: deletedLift });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting lift' });
    }
};

const editLift = async (req, res) => {
    try {
        const { id } = req.params;
        const { exercise, sets, reps, weight, notes, date } = req.body;

        const updatedLift = await LiftModel.update(id, {
            exercise,
            sets,
            reps,
            weight,
            notes,
            date
        });

        if (!updatedLift) {
            return res.status(404).json({ message: 'Lift not found' });
        }

        return res.status(200).json(updatedLift);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating lift' });
    }
};

const getLiftStats = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const stats = await LiftModel.getStats(userId);
        return res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving lift stats' });
    }
};

const getPersonalRecords = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const personalRecords = await LiftModel.getPersonalRecords(userId);
        return res.status(200).json(personalRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving personal records' });
    }
};

export { 
    getLifts, 
    addLift, 
    deleteLift, 
    editLift, 
    getLiftStats, 
    getPersonalRecords 
};
