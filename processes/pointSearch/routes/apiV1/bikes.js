'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/bikesController');

router.get('/networks', eventHandler.getBikeNetworks);

module.exports = router;
