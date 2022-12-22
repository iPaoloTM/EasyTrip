'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const eventHandler = require('../../controllers/esempioController');

router.post('/es1', verifyToken, eventHandler.es1);

router.post('/es2', eventHandler.es2);

module.exports = router;