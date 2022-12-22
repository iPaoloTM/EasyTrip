'use strict';

const express = require('express');
const router = express.Router();

const eventHandler = require('../../controllers/userController');

router.post('/login', eventHandler.login_users);

router.post('/signup', eventHandler.signup_users);

module.exports = router;