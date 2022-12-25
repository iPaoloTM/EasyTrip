'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const eventHandler = require('../../controllers/weatherController');

router.get('/current', eventHandler.current);

router.get('/about', function(req, res) {
  res.send('About weather');
});

module.exports = router;
