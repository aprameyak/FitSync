
import express from 'express';
import { 
    getCalories, 
    updateCalories, 
    createCalories, 
    getCaloriesStats 
} from '../controllers/caloriescontroller.js';

const router = express.Router();

router.get('/user/:userId', getCalories);
router.post('/', createCalories);
router.put('/user/:userId', updateCalories);
router.get('/user/:userId/stats', getCaloriesStats);

export default router;
