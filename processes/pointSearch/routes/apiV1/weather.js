'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/weatherController');

router.get('/current', eventHandler.current);

router.get('/forecast', eventHandler.forecast);

router.get('/about', function(req, res) {
  res.send('About weather');
});

module.exports = router;
