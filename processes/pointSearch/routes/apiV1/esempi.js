'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const eventHandler = require('../../controllers/esempioController');

router.post('/es1', verifyToken, eventHandler.es1);

router.post('/es2', eventHandler.es2);

router.get('/es1', function(res,req) {
  res.send('About birds');
});

module.exports = router;
