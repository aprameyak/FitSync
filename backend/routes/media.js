
import express from 'express';
import { 
    getMedia, 
    addMedia, 
    updateMedia, 
    deleteMedia, 
    getMediaStats 
} from '../controllers/mediacontroller.js';

const router = express.Router();

router.get('/user/:userId', getMedia);
router.post('/', addMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);
router.get('/user/:userId/stats', getMediaStats);

export default router;
