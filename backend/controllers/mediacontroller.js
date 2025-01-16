const Media = require('../models/mediamodel');
const mongoose = require('mongoose');

const getMedia = async (req, res) => {
    try {
        const media = await Media.find({});
        if (!media) {
            return res.status(404).json({ error: 'Media data not found' });
        }

        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media', details: error.message });
    }
};

const addMedia = async (req, res) => {
    const { message } = req.body;
    try {
        media = await Media.create({
            message,
        })
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMedia,
    addMedia,
};
