'use strict';

const express = require('express');
const apiV2 = express.Router();

const combinedRouter = require('./apiV2/OSMcombined');

// middleware that tracks request
apiV2.use(function timeLog(req, res, next) {
  console.log(`Requested ${req.originalUrl} From ${req.headers['x-forwarded-for']} Time: ${Date.now()}`);
	next();
});

apiV2.use('/combined', combinedRouter);

module.exports = apiV2;
