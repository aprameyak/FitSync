import express from 'express';
import { 
    createFitness, 
    getFitness, 
    getFitnesses, 
    deleteFitness, 
    updateFitness, 
    getFitnessStats 
} from '../controllers/fitnesscontroller.js';

const router = express.Router();

router.post('/', createFitness);
router.get('/:id', getFitness);
router.get('/user/:userId', getFitnesses);
router.get('/user/:userId/stats', getFitnessStats);
router.delete('/:id', deleteFitness);
router.put('/:id', updateFitness);

export default router;