const express = require('express');
const router = express.Router();
const { 
    getLifts, 
    addLift,
    deleteLift,
    editLift,
} = require('../controllers/liftcontroller');

router.get('/:userId', getLifts);

router.post('/', addLift);

router.delete('/:id', deleteLift);

router.patch('/:id', editLift);

module.exports = router;
