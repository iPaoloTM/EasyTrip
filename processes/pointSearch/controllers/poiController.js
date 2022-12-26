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

    var lat=0, long=0;
    const city=req.query.city;
    const array = [];

    amadeus.referenceData.locations.cities.get({
        keyword: city
    }).then(function (response) {
        console.log(response.data[0]);
        lat = response.data[0].geoCode["latitude"];
        long = response.data[0].geoCode["longitude"];

        amadeus.referenceData.locations.pointsOfInterest.get({
          latitude : lat,
          longitude : long
        }).then(function (response) {

          response.result.data.forEach((item, i) => {
            array[i]=item.name;
          });

          res.status(200).json({
              success: true,
              message: array

          });
        }).catch(function (response) {

          res.status(400).json({
              success: false,
              message: response

        });
      });
    }).catch(function (response) {

      res.status(400).json({
          success: false,
          message: response
      });

    });


};
