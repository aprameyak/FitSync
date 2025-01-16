const express = require('express');
const router = express.Router();
const {
    createProfile,
    updateProfile,
    getProfile,
} = require('../controllers/profilecontroller');

router.get('/:userId', getProfile);
router.post('/', createProfile);
router.patch('/:userId', updateProfile);

module.exports = router;
