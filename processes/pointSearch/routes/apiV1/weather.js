'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/weatherController');

router.get('/current', eventHandler.current);

router.get('/forecast', eventHandler.forecast);

module.exports = router;
