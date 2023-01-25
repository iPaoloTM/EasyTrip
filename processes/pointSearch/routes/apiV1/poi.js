'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/poiController');

router.get('/get', eventHandler.getPOI);

router.get('/about', function(req, res) {
  res.send('About POI');
});

module.exports = router;
