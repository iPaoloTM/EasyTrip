'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const { arrayToStr } = require('../../../common/functions');
const { OSM_TOOLS_URL,POINT_SEARCH_URL, INTERESTS } = require('../../../common/dataStructures');

const request = require('request-promise');

module.exports.destination = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    var interests='';

    req.query.interest.forEach((item, i) => {
      interests+='&interest='+item
    });

    try {
      const response = await request(POINT_SEARCH_URL + '/v2/combined/about?end='+req.query.end+'&weather='+req.query.weather+'&bikes='+req.query.bikes+interests);
      const responseBody = JSON.parse(response);

      res.status(200).json({
          success: true,
          message: responseBody
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
          success: false,
          message: MSG.badRequest
      });
    }

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
