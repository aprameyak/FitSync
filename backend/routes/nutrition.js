const express = require('express')
const router = express.Router()
const {
    createNutrition,
    getNutrition,
    getNutritions,
    deleteNutrition,
    updateNutrition
} = require('../controllers/nutritioncontroller')

router.get('/', getNutrition) 

router.get('/:userId', getNutritions)

router.post('/', createNutrition) 

router.delete('/:id', deleteNutrition)

router.patch('/:id', updateNutrition)

module.exports = router