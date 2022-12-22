'use strict';

const express = require('express');
const apiV1 = express.Router();

const usersRouter = require('./apiV1/users');
const esempiRouter = require('./apiV1/esempi');

// middleware that tracks request
apiV1.use(function timeLog(req, res, next) {
  console.log(`Requested ${req.originalUrl} From ${req.headers['x-forwarded-for']} Time: ${Date.now()}`);
	next();
});

apiV1.use('/users', usersRouter);
apiV1.use('/esempi', esempiRouter);

module.exports = apiV1;