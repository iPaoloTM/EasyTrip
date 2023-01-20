'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

module.exports.destination = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.status(200).json({
        success: true,
        //user: req.loggedUser,
        message: 'ES1 con token'
    });
};

module.exports.stops = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

	res.status(200).json({
        success: true,
        //user: req.loggedUser,
        message: 'ES2 senza token'
    });
};