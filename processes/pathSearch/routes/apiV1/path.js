'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const eventHandler = require('../../controllers/pathController');

router.get('/stops',/* verifyToken,*/ eventHandler.stops);

router.get('/route',/* verifyToken,*/ eventHandler.route);

module.exports = router;