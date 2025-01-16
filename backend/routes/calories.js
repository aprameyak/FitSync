
const express = require('express');
const router = express.Router();
const { 
    getCalories, 
    updateCalories,
    createCalories
} = require('../controllers/caloriescontroller');

router.get('/:userId', getCalories);

router.post('/', createCalories);

router.patch('/:userId', updateCalories);

module.exports = router;
