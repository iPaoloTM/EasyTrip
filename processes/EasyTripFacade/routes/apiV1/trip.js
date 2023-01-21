'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const eventHandler = require('../../controllers/tripController');

router.get('/destination'/*, verifyToken*/, eventHandler.destination);

router.get('/travel'/*, verifyToken*/, eventHandler.travel);

module.exports = router;