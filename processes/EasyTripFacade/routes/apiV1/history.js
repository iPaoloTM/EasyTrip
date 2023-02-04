'use strict';

const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');

const historyHandler = require('../../controllers/historyController');

router.post('/', verifyToken, historyHandler.saveTrip);

router.get('/', verifyToken, historyHandler.getTrips);

router.delete('/:id', verifyToken, historyHandler.deleteTrip);

module.exports = router;