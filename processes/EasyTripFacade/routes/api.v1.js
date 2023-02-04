'use strict';

const express = require('express');
const apiV1 = express.Router();

const tripRouter = require('./apiV1/trip');
const historyRouter = require('./apiV1/history');

// middleware that tracks request
apiV1.use(function timeLog(req, res, next) {
  console.log(`Requested ${req.originalUrl} From ${req.headers['x-forwarded-for']} Time: ${Date.now()}`);
	next();
});

apiV1.use('/trip', tripRouter);
apiV1.use('/history', historyRouter);

module.exports = apiV1;