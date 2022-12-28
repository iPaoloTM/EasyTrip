'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise');

const eventHandler = require('../../controllers/esempioController');
const weatherHandler = require('../../controllers/weatherController');
const poiHandler = require('../../controllers/poiController');
const bikeHandler = require('../../controllers/bikesController');

router.get('/about', async (req, res) => {

  async function getDataFromWeatherEndpoint() {
  try {
    const response = await request('http://localhost:12346/v1/weather/forecast?city='+req.query.city);
    const responseBody = JSON.parse(response);
    //console.log(response);
    return responseBody;
    } catch (error) {
      console.error(error)
    }
  }

  async function getDataFromPOIEndpoint() {
  try {
    const response = await request('http://localhost:12346/v1/poi/get?city='+req.query.city);
    const responseBody = JSON.parse(response);
    //console.log(response);
    return responseBody;
    } catch (error) {
      console.error(error)
    }
  }

  async function getDataFromBikeEndpoint() {
  try {
    const response = await request("https://api.citybik.es/v2/networks");
    const responseBody = JSON.parse(response);
    var result=0;
    console.log(responseBody)
    responseBody.networks.forEach((item, i) => {

      if (responseBody.networks[i].location.city === req.query.city) {
        result=responseBody.networks[i];
      }
    });
    console.log(result);
    return result;
    } catch (error) {
      console.error(error)
    }
  }

  const weatherResponse = await getDataFromWeatherEndpoint();
  const poiResponse = await getDataFromPOIEndpoint();
  const bikeResponse = await getDataFromBikeEndpoint();

  res.status(200).json({
      success: true,
      message: weatherResponse.message+" and these are the point of interests you can visit"+poiResponse.message+" and this is the bike sharing service available: "+bikeResponse.name
  });

});

module.exports = router;
