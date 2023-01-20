'use strict';

const express = require('express');
const apiV1 = express.Router();

const tripRouter = require('./apiV1/trip');

// middleware that tracks request
apiV1.use(function timeLog(req, res, next) {
  console.log(`Requested ${req.originalUrl} From ${req.headers['x-forwarded-for']} Time: ${Date.now()}`);
	next();
});

apiV1.use('/trip', tripRouter);

module.exports = apiV1;