'use strict';

const { arrayToStr } = require('../../../common/functions');
const { OSM_TOOLS_URL,POINT_SEARCH_URL, INTERESTS } = require('../../../common/dataStructures');

const request = require('request-promise');

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
}

module.exports.getCombined = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);


      async function getCurrentDataFromWeatherEndpoint(city) {
      try {
        const currResponse = await request(POINT_SEARCH_URL + '/v1/weather/current?city='+city);
        const currWeather = JSON.parse(currResponse);

        return currWeather.message;
        } catch (error) {
          //console.error(error);
          return [];
        }
      }

      async function getForecastsDataFromWeatherEndpoint(city) {
      try {

        const forecastResponse = await request(POINT_SEARCH_URL + '/v1/weather/forecast?city='+city);
        const forecastWeather = JSON.parse(forecastResponse);

        return forecastWeather.message;
        } catch (error) {
          //console.error(error);
          return [];
        }
      }

      async function getDataFromGeoCode() {
      try {
        const geocode = await request(OSM_TOOLS_URL + '/v1/routing/geocode?address='+req.query.address+'&limit=1');
        const responseGeocode = JSON.parse(geocode);

        return responseGeocode.hits[0];
        } catch (error) {
          //console.error(error);
          return [];
        }
      }

      async function getDataFromPOIEndpoint(city) {
      let results;
      try {

        const geocode = await request(OSM_TOOLS_URL + '/v1/routing/geocode?address='+city+'&limit=1');
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
        return results;
      }

      async function getDataFromBikeEndpoint(city) {
      try {

        const response = await request(POINT_SEARCH_URL + '/v1/bikes/networks?city='+city);
        const responseBody = JSON.parse(response);

        return responseBody.message;
        } catch (error) {
          //console.error(error)
          return "empty";
        }
      }

      const address = req.query.address
      const interests = req.query.interest
      const weatheFlag = req.query.weather
      const bikeFlag = req.query.bikes

      var geocodeResponse; // = await getDataFromGeoCode();
      var city; //city of geocodeResponse
      var currentWeatherResponse; // = await getCurrentDataFromWeatherEndpoint();
      var forecastsWeatherResponse; // = await getForecastsDataFromWeatherEndpoint();
      var bikeResponse; // = await getDataFromBikeEndpoint();
      var poiResponse; // = await getDataFromPOIEndpoint();

      if (address != undefined) {
        geocodeResponse = await getDataFromGeoCode();

        if (geocodeResponse != undefined) {
          city = geocodeResponse.city ?? geocodeResponse.name;
          if (city != undefined) {
            if (interests != undefined) {
              poiResponse = await getDataFromPOIEndpoint(city);
            }
  
            if (weatheFlag === "true") {
              currentWeatherResponse = await getCurrentDataFromWeatherEndpoint(city);
              forecastsWeatherResponse = await getForecastsDataFromWeatherEndpoint(city);
            }
  
            if (bikeFlag === "true")
              bikeResponse = await getDataFromBikeEndpoint(city);
            
            res.status(200).json({
                address: geocodeResponse,
                weather: currentWeatherResponse != undefined && forecastsWeatherResponse != null ? {current: currentWeatherResponse, forecasts: forecastsWeatherResponse} : undefined,
                bike: bikeResponse,
                poi: poiResponse
            });
          } else {
            res.status(400).json({
                error: MSG.badRequest
            });
          }
        } else {
          res.status(400).json({
              error: MSG.badRequest
          });
        }
      } else {
        res.status(400).json({
            error: MSG.badRequest
        });
      }
};
