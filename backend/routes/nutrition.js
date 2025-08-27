import express from 'express';
import { 
    createNutrition, 
    getNutrition, 
    getNutritions, 
    deleteNutrition, 
    updateNutrition, 
    getNutritionStats 
} from '../controllers/nutritioncontroller.js';

const router = express.Router();

router.post('/', createNutrition);
router.get('/:id', getNutrition);
router.get('/user/:userId', getNutritions);
router.get('/user/:userId/stats', getNutritionStats);
router.delete('/:id', deleteNutrition);
router.put('/:id', updateNutrition);

export default router;