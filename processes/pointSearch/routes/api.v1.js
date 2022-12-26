'use strict';

const express = require('express');
const apiV1 = express.Router();

const esempiRouter = require('./apiV1/esempi');
const provaWeather = require('./apiV1/weather');
const poi = require('./apiV1/poi');

// middleware that tracks request
apiV1.use(function timeLog(req, res, next) {
  console.log(`Requested ${req.originalUrl} From ${req.headers['x-forwarded-for']} Time: ${Date.now()}`);
	next();
});

apiV1.use('/esempi', esempiRouter);
apiV1.use('/weather', provaWeather);
apiV1.use('/poi', poi);

module.exports = apiV1;
