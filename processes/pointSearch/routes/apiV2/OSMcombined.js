'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise');

const combinedHandler = require('../../controllers/OSMcombinedController');

router.get('/about', combinedHandler.getCombined);

module.exports = router;
