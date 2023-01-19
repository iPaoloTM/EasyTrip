'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const request = require('request-promise');

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getCombined = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);


      async function getDataFromWeatherEndpoint() {
      try {
        const currResponse = await request('http://localhost:12347/v1/weather/current?city='+req.query.city);
        const currWeather = JSON.parse(currResponse);

        const forecastResponse = await request('http://localhost:12347/v1/weather/forecast?city='+req.query.city);
        const forecastWeather = JSON.parse(forecastResponse);

        const response = '"current": "'+currWeather.message+'", "forecasts": ['+forecastWeather.message+']'

        return response;
        } catch (error) {
          console.error(error)
        }
      }

      async function getDataFromGeoCode() {
      try {
        const geocode = await request('http://localhost:12346/v1/routing/geocode?address='+req.query.city+'&limit=1');
        const responseGeocode = JSON.parse(geocode);

        return responseGeocode.hits;
        } catch (error) {
          console.error(error);
        }
      }

      async function getDataFromPOIEndpoint() {
      try {
        const geocode = await request('http://localhost:12346/v1/routing/geocode?address='+req.query.city+'&limit=1');
        const responseGeocode = JSON.parse(geocode);

        const coord = responseGeocode.hits[0].point.lat + "," + responseGeocode.hits[0].point.lng
        const bBox = responseGeocode.hits[0].extent

        const response = await request('http://localhost:12346/v1/locations/poi?point='+coord+'&squareSide=1000&interest=Sustenance&interest=Torusim');
        const responseBody = JSON.parse(response);

        return responseBody.elements;
        } catch (error) {
          console.error(error+" from poi")
        }
      }

      async function getDataFromBikeEndpoint() {
      try {
        const response = await request('http://localhost:12347/v1/bikes/networks?city='+req.query.city);
        const responseBody = JSON.parse(response);

        return responseBody.message;
        } catch (error) {
          console.error(error)
        }
      }

      const geocodeResponse = await getDataFromGeoCode();
      const weatherResponse = await getDataFromWeatherEndpoint();
      const bikeResponse = await getDataFromBikeEndpoint();
      const poiResponse = await getDataFromPOIEndpoint();

      res.status(200).json({
          success: true,
          city: geocodeResponse,
          weather:weatherResponse,
          bike: bikeResponse,
          poi: poiResponse
      });


};
