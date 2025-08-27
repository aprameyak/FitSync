import ProfileModel from '../models/profilemodel.js';

const createProfile = async (req, res) => {
    const { userId, weight, height, age, gender, activityLevel, goal } = req.body;
    try {
        const newProfile = await ProfileModel.create({ 
            userId, 
            weight, 
            height, 
            age, 
            gender, 
            activityLevel, 
            goal 
        });
        res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile', error: error.message });
    }
};

const getProfile = async (req, res) => {
    const { userId } = req.params;  
    try {
        const profile = await ProfileModel.findByUserId(userId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.params; 
    try {
        const updatedProfile = await ProfileModel.update(userId, req.body);
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const upsertProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const profile = await ProfileModel.upsert(userId, req.body);
        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        res.status(500).json({ message: 'Error upserting profile', error: error.message });
    }
};

export { createProfile, getProfile, updateProfile, upsertProfile };
