
const express = require('express');
const router = express.Router();
const { 
    getMedia, 
    addMedia,
} = require('../controllers/mediacontroller');

router.get('/', getMedia);

router.post('/', addMedia);

module.exports = router;
