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


      async function getCurrentDataFromWeatherEndpoint() {
      try {
        const currResponse = await request('http://localhost:12347/v1/weather/current?city='+req.query.city);
        const currWeather = JSON.parse(currResponse);

        return currWeather.message;
        } catch (error) {
          console.error(error)
          return "No current weather data"
        }
      }

      async function getForecastsDataFromWeatherEndpoint() {
      try {

        const forecastResponse = await request('http://localhost:12347/v1/weather/forecast?city='+req.query.city);
        const forecastWeather = JSON.parse(forecastResponse);

        return forecastWeather.message;
        } catch (error) {
          console.error(error)
          return "No forecast weather data"
        }
      }

      async function getDataFromGeoCode() {
      try {
        const geocode = await request('http://localhost:12346/v1/routing/geocode?address='+req.query.city+'&limit=1');
        const responseGeocode = JSON.parse(geocode);

        return responseGeocode.hits;
        } catch (error) {
          console.error(error);
          return "No geocode data"
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
          console.error(error)
          return "No Point of Interests to visit"
        }
      }

      async function getDataFromBikeEndpoint() {
      try {
        const response = await request('http://localhost:12347/v1/bikes/networks?city='+req.query.city);
        const responseBody = JSON.parse(response);

        return responseBody.message;
        } catch (error) {
          console.error(error)
          return "No bike sharing data";
        }
      }

      const geocodeResponse = await getDataFromGeoCode();
      const currentWeatherResponse = await getCurrentDataFromWeatherEndpoint();
      const forecastsWeatherResponse = await getForecastsDataFromWeatherEndpoint();
      const bikeResponse = await getDataFromBikeEndpoint();
      const poiResponse = await getDataFromPOIEndpoint();

      res.status(200).json({
          success: true,
          city: geocodeResponse[0],
          weather: {current: currentWeatherResponse, forecasts: forecastsWeatherResponse},
          bike: bikeResponse,
          poi: poiResponse[0]
      });


};
