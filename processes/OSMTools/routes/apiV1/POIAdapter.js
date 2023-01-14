'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const POIAdapter = require('../../controllers/POIAdapter');

router.get('/poi',/* verifyToken,*/ POIAdapter.poi);

router.get('/nearbyCities',/* verifyToken,*/ POIAdapter.nearbyCities);

module.exports = router;