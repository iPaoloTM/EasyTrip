'use strict';

const express = require('express');
const cors = require('cors');

// require apiV1 routes
const apiV1 = require('./routes/api.v1');
const apiV2 = require('./routes/api.v2');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/v1', apiV1);
app.use('/v2', apiV2);

module.exports = app;
