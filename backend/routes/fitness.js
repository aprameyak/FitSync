const express = require('express')
const router = express.Router()
const {
    createFitness,
    getFitness,
    getFitnesses,
    deleteFitness,
    updateFitness
} = require('../controllers/fitnesscontroller')

router.get('/', getFitness) 

router.get('/:userId', getFitnesses)

router.post('/', createFitness) 

router.delete('/:id', deleteFitness)

router.patch('/:id', updateFitness)

module.exports = router