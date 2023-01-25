'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/tripController');

router.get('/destination', eventHandler.destination);

router.get('/travel', eventHandler.travel);

module.exports = router;