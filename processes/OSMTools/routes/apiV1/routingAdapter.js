'use strict';

const express = require('express');
const router = express.Router();

const routingAdapter = require('../../controllers/routingAdapter');

router.get('/geocode', routingAdapter.geocode);

router.get('/route', routingAdapter.route);

module.exports = router;