import express from 'express';
import { 
    getLifts, 
    addLift, 
    deleteLift, 
    editLift, 
    getLiftStats, 
    getPersonalRecords 
} from '../controllers/liftcontroller.js';

const router = express.Router();

router.get('/user/:userId', getLifts);
router.post('/', addLift);
router.delete('/:id', deleteLift);
router.put('/:id', editLift);
router.get('/user/:userId/stats', getLiftStats);
router.get('/user/:userId/records', getPersonalRecords);

export default router;
