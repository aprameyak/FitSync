import MediaModel from '../models/mediamodel.js';

const getMedia = async (req, res) => {
    const { userId } = req.params;
    const { type } = req.query;
    
    try {
        let media;
        if (type) {
            media = await MediaModel.findByType(userId, type);
        } else {
            media = await MediaModel.findByUserId(userId);
        }
        
        if (!media || media.length === 0) {
            return res.status(404).json({ error: 'Media data not found' });
        }

        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media', details: error.message });
    }
};

const addMedia = async (req, res) => {
    const { userId, type, url, title, description } = req.body;
    try {
        const media = await MediaModel.create({
            userId,
            type,
            url,
            title,
            description
        });
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMedia = async (req, res) => {
    const { id } = req.params;
    try {
        const media = await MediaModel.update(id, req.body);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Error updating media', details: error.message });
    }
};

const deleteMedia = async (req, res) => {
    const { id } = req.params;
    try {
        const media = await MediaModel.delete(id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting media', details: error.message });
    }
};

const getMediaStats = async (req, res) => {
    const { userId } = req.params;
    try {
        const stats = await MediaModel.getStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching media stats', details: error.message });
    }
};

export { 
    getMedia, 
    addMedia, 
    updateMedia, 
    deleteMedia, 
    getMediaStats 
};
