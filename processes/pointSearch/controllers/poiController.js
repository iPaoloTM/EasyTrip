'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getPOI = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    var Amadeus = require("amadeus");
    var amadeus = new Amadeus({
    clientId: process.env.API_KEY,
    clientSecret: process.env.API_SECRET
    });

    amadeus.referenceData.locations.pointsOfInterest.get({
      latitude : 52.531677,
      longitude : 13.381777
    }).then(function (response) {
        console.log(response);
    }).catch(function (response) {
        console.error(response);
    });

    res.status(200).json({
        success: true,
        message: "b"
    });
};
