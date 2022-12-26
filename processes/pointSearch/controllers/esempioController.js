'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const weather = require('./weatherController');
const poi = require('./poiController');

module.exports.es1 = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.status(200).json({
        success: true,
        user: req.loggedUser,
        message: 'ES1 con token'
    });
};

module.exports.es2 = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

	res.status(200).json({
        success: true,
        message: 'ES2 senza token'
    });
};

module.exports.about = async (req, res) => {

    const weather_info = weather.f(req, res);
    console.log(weather_info);
    const array = poi.g(req, res);
    console.log(array);

    res.status(200).json({
          success: true,
          message: weather_info
      });
};
