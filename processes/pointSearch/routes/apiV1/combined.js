'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise');

const eventHandler = require('../../controllers/esempioController');
const weatherHandler = require('../../controllers/weatherController');
const poiHandler = require('../../controllers/poiController');

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

  const weatherResponse = await getDataFromWeatherEndpoint();
  const poiResponse = await getDataFromPOIEndpoint();

  res.status(200).json({
      success: true,
      message: weatherResponse.message+" and these are the point of interests you can visit"+poiResponse.message
  });

});

module.exports = router;
