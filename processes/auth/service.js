'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');

// require apiV1 routes
const apiV1 = require('./routes/api.v1');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/v1', apiV1);

module.exports = app;