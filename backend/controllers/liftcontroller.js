const Lift = require('../models/liftmodel');


const getLifts = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const lifts = await Lift.find({ userId });

        return res.status(200).json(lifts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving lifts' });
    }
};

const addLift = async (req, res) => {
    try {
        const { userId, exercise, repetitions, load } = req.body;

        if (!userId || !exercise || !repetitions) {
            return res.status(400).json({ message: 'UserId, exercise, and repetitions are required' });
        }

        const newLift = new Lift({
            userId,
            exercise,
            repetitions,
            load, 
        });

        const savedLift = await newLift.save();

        return res.status(201).json(savedLift);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding lift' });
    }
};

const deleteLift = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLift = await Lift.findByIdAndDelete(id);

        if (!deletedLift) {
            return res.status(404).json({ message: 'Lift not found' });
        }

        return res.status(200).json({ message: 'Lift deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting lift' });
    }
};

const editLift = async (req, res) => {
    try {
        const { id } = req.params;
        const { exercise, repetitions, load } = req.body;

        const updatedLift = await Lift.findByIdAndUpdate(
            id,
            { exercise, repetitions, load },
            { new: true } 
        );

        if (!updatedLift) {
            return res.status(404).json({ message: 'Lift not found' });
        }

        return res.status(200).json(updatedLift);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating lift' });
    }
};

module.exports = {
    getLifts,
    addLift,
    deleteLift,
    editLift,
};
