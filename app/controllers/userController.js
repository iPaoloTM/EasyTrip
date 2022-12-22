'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const model = require('../models/users');
const User = mongoose.model('User',model);
const tokenGenerator = require('../utils/tokenGenerator');

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

module.exports.login_users = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

	const { username, password } = req.body;

	if(!username || !password){
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters. /api/api-docs' });	
		return;
	}
	
	// find the user
	let user = await User.findOne({
		username: username
	});
	
	// user not found
	if (!user) {
		res.status(400).json({ success: false, message: 'Authentication failed. Wrong username or password.' });	
		return;
	}
	
	if(await bcrypt.compare(password, user.psw)) {
		//if user is found and password is right create a token
		let token = tokenGenerator(user);
		
		res.status(200).json({
			success: true,
			message: 'Token sucessfully created',
			token: token,
			username: user.username,
			id: user._id,
			self: "/api/v1/users/" + user._id,
		});
		return;
	}

	res.status(400).json({ success: false, message: 'Authentication failed. Wrong username or password.' });
};

module.exports.signup_users = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

	if(!req.body.username || !req.body.password || !req.body.email){
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters. /api/api-docs' });	
		return;
	}

	// find the user
	let userAlreadyExists = await User.findOne({
		username: req.body.username
	});
	
	// user already exists
	if (userAlreadyExists) {
		res.status(409).json({ success: false, message: 'Signup failed. User already exists.' });
		return;
	}
	
	let pswHash = await bcrypt.hash(req.body.password, 10);
    
    const newUser = await User.create({
		username: req.body.username, 
		email: req.body.email, 
		psw: pswHash,
	});
	
	let token = tokenGenerator(newUser);
	
	res.status(201).json({
		success: true,
		message: 'Signup completed!',
		token: token,
		username: newUser.username,
		id: newUser._id,
		self: "/api/v1/users/" + newUser._id
	});

};