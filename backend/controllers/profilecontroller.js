const Profile = require('../models/profilemodel');
const mongoose = require('mongoose');

const createProfile = async (req, res) => {
    const { userId, weight, height, age, gender } = req.body;
    try {
        const newProfile = new Profile({ userId, weight, height, age, gender });
        await newProfile.save();
        res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile', error: error.message });
    }
};

const getProfile = async (req, res) => {
    const { userId } = req.params;  
    try {
        const profile = await Profile.findOne({ userId });
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
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId }, 
            { ...req.body }, 
            { new: true } 
        );
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
};
