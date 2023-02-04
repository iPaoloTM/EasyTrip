'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/pathController');

router.get('/stops', eventHandler.stops);

router.get('/route', eventHandler.routeGET);

router.post('/route', eventHandler.routePOST);

module.exports = router;