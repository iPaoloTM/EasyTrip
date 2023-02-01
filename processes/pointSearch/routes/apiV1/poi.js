'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/poiController');

router.get('/get', eventHandler.getPOI);

module.exports = router;
