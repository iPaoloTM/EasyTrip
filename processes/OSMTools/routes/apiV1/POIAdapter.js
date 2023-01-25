'use strict';

const express = require('express');
const router = express.Router();

const POIAdapter = require('../../controllers/POIAdapter');

router.get('/poi', POIAdapter.poi);

router.get('/nearbyCities', POIAdapter.nearbyCities);

module.exports = router;