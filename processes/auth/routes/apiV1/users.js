'use strict';

const express = require('express');
const router = express.Router();

const userHandler = require('../../controllers/userController');
//const googleHandler = require('../../middleware/googleauth')

router.post('/login', userHandler.login_users);

router.post('/signup', userHandler.signup_users);

//router.use('/google', googleHandler)

module.exports = router;