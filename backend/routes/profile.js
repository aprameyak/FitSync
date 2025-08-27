import express from 'express';
import { createProfile, getProfile, updateProfile, upsertProfile } from '../controllers/profilecontroller.js';

const router = express.Router();

router.post('/:userId', createProfile);
router.get('/:userId', getProfile);
router.put('/:userId', updateProfile);
router.patch('/:userId', upsertProfile);

export default router;
