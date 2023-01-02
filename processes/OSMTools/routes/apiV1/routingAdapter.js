'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const routingAdapter = require('../../controllers/routingAdapter');

router.get('/geocode', routingAdapter.geocode);

router.get('/route',/* verifyToken,*/ routingAdapter.route);

module.exports = router;