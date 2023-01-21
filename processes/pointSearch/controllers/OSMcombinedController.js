'use strict';

const { arrayToStr } = require('../../../common/functions');
const { OSM_TOOLS_URL,POINT_SEARCH_URL, INTERESTS } = require('../../../common/dataStructures');

const request = require('request-promise');

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

module.exports.getCombined = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);


      async function getCurrentDataFromWeatherEndpoint() {
      try {
        const currResponse = await request(POINT_SEARCH_URL + '/v1/weather/current?city='+req.query.end);
        const currWeather = JSON.parse(currResponse);

        return currWeather.message;
        } catch (error) {
          console.error(error)
          return "No current weather data"
        }
      }

      async function getForecastsDataFromWeatherEndpoint() {
      try {

        const forecastResponse = await request(POINT_SEARCH_URL + '/v1/weather/forecast?city='+req.query.end);
        const forecastWeather = JSON.parse(forecastResponse);

        return forecastWeather.message;
        } catch (error) {
          console.error(error)
          return "No forecast weather data"
        }
      }

      async function getDataFromGeoCode() {
      try {
        const geocode = await request(OSM_TOOLS_URL + '/v1/routing/geocode?address='+req.query.end+'&limit=1');
        const responseGeocode = JSON.parse(geocode);

        return responseGeocode.hits[0];
        } catch (error) {
          console.error(error);
          return "No geocode data"
        }
      }

      async function getDataFromPOIEndpoint() {
      let results;
      try {

        const geocode = await request(OSM_TOOLS_URL + '/v1/routing/geocode?address='+req.query.end+'&limit=1');
        const responseGeocode = JSON.parse(geocode);

        const interests = Array.isArray(req.query.interest) ? req.query.interest : [req.query.interest];
        let url = OSM_TOOLS_URL + '/v1/locations/poi?' + arrayToStr(interests,"&interest=",true);
        if (responseGeocode.hits[0] != undefined) {
          if (responseGeocode.hits[0].extent != undefined) {
            const bBox = responseGeocode.hits[0].extent;
            url += "&bbox=" + arrayToStr(bBox,",");
          } else {
            url += "&squareSide=20000&point=" + responseGeocode.hits[0].point.lat + "," + responseGeocode.hits[0].point.lng;
          }
          const response = await request(url);
          const responseBody = JSON.parse(response);

          results = responseBody.elements;
        } else {
          results = [];
        }
        } catch (error) {
          //console.error(error)
          results = [];
        }
        return results.length ? results : "No Point of Interests to visit";
      }

      async function getDataFromBikeEndpoint() {
      try {

        const response = await request(POINT_SEARCH_URL + '/v1/bikes/networks?city='+req.query.end);
        const responseBody = JSON.parse(response);

        return responseBody.message;
        } catch (error) {
          //console.error(error)
          return "No bike sharing data";
        }
      }

      const endCity = req.query.end
      const interests = req.query.interest
      const weatheFlag = req.query.weather
      const bikeFlag = req.query.bikes

      var geocodeResponse; // = await getDataFromGeoCode();
      var currentWeatherResponse; // = await getCurrentDataFromWeatherEndpoint();
      var forecastsWeatherResponse; // = await getForecastsDataFromWeatherEndpoint();
      var bikeResponse; // = await getDataFromBikeEndpoint();
      var poiResponse; // = await getDataFromPOIEndpoint();

      if (endCity != undefined) {
        geocodeResponse = await getDataFromGeoCode();

        if (interests != undefined) {
          poiResponse = await getDataFromPOIEndpoint();
        }
      }

      if (weatheFlag === "true") {
        currentWeatherResponse = await getCurrentDataFromWeatherEndpoint();
        forecastsWeatherResponse = await getForecastsDataFromWeatherEndpoint();
      }

      if (bikeFlag === "true")
        bikeResponse = await getDataFromBikeEndpoint();


      res.status(200).json({
          city: geocodeResponse,
          weather: currentWeatherResponse != undefined && forecastsWeatherResponse != null ? {current: currentWeatherResponse, forecasts: forecastsWeatherResponse} : undefined,
          bike: bikeResponse,
          poi: poiResponse
      });


};
