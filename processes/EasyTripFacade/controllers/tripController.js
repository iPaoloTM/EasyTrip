'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
}

const { INTERESTS, PROFILES, POINT_SEARCH_URL, PATH_SEARCH_URL } = require('../../../common/dataStructures');
const { cleanWrtStruct, arrayToStr } = require('../../../common/functions');

const request = require('request-promise');

module.exports.destination = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const interests= Array.isArray(req.query.interest) ? req.query.interest : [req.query.interest];

    try {
      const response = await request(POINT_SEARCH_URL + '/v2/combined/about?address='+req.query.address+'&weather='+req.query.weather+'&bikes='+req.query.bikes+arrayToStr(interests,"&interest=",true));
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

module.exports.travel = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    let start = req.query.start;
    let end = req.query.end;
    let weather = req.query.weather;
    let bikes = req.query.bikes;
    let interests = Array.isArray(req.query.interest) ? req.query.interest : [req.query.interest];
    let strLimit = req.query.limit;
    let minDistanceStr = req.query.minDistance;
    let maxDetourStr = req.query.maxDetour;
    let profile = req.query.profile;
    
    let toDo = {
        weather: false,
        bikes: false,
        poi: false,
        stops: false,
    }
    let right = true;
    let travel = {};
    let limit,minDistance,maxDetour,detourAllwoed,url,i,pathSearchRes,pointSearchRes;

    if (start != undefined && end != undefined) {
        toDo.weather = weather === "true";
        toDo.bikes = bikes === "true";
        toDo.poi = (interests = cleanWrtStruct(interests,INTERESTS)).length != 0;
        toDo.stops = toDo.poi && !isNaN(limit = parseInt(strLimit)) && limit > 0 && limit <= 8;
        if (toDo.stops) {
            minDistance = parseFloat(minDistanceStr);
            maxDetour = parseFloat(maxDetourStr);
            if (isNaN(minDistance)) {
                minDistance = 20000;
            }
            detourAllwoed = minDistance/2;
            if (isNaN(maxDetour) || maxDetour > detourAllwoed) {
                maxDetour = detourAllwoed;
            }
            if (PROFILES[profile] == undefined) {
                profile = "car";
            }
        }
    } else {
        right = false;
    }

    if (right) {
        url = PATH_SEARCH_URL + "/v1/path";
        if (toDo.stops) {
            try {
                url += "/stops?poisDescriptions=false&start=" + start
                    + "&end=" + end
                    + "&limit=" + limit
                    + "&minDistance=" + minDistance
                    + "&maxDetour=" + maxDetour
                    + "&profile=" + profile
                    + arrayToStr(interests,"&interest=",true);
                pathSearchRes = await (request(url).then(response => JSON.parse(response)));
                travel = {
                    start: {
                        address: pathSearchRes.stops.start
                    },
                    end: {
                        address: pathSearchRes.stops.end
                    },
                    intermediates: new Array(pathSearchRes.stops.intermediates.length),
                    paths: []
                }
                url = POINT_SEARCH_URL + "/v2/combined/about?"
                    + "&address=" + end
                    + "&weather=" + (toDo.weather ? "true" : "false")
                    + "&bikes=" + (toDo.bikes ? "true" : "false")
                    + (toDo.poi ? arrayToStr(interests,"&interest=",true) : "");
                for (i = 0; i < pathSearchRes.stops.intermediates.length; i++) {
                    travel.intermediates[i] = {
                        address: pathSearchRes.stops.intermediates[i].details,
                    }
                    pointSearchRes = await (request(url).then(response => JSON.parse(response)));
                    if (toDo.weather) {
                        travel.intermediates[i].weather = pointSearchRes.weather;
                    }
                    if (toDo.bikes) {
                        travel.intermediates[i].bike = pointSearchRes.bike;
                    }
                    if (toDo.poi) {
                        travel.intermediates[i].poi = pathSearchRes.stops.intermediates[i].pois;
                    }
                }
                travel.end = await (request(url)).then(response => JSON.parse(response));
                travel.paths = (await request(PATH_SEARCH_URL + "/v1/path/route?profile=" + profile,{
                    method: "POST",
                    body: pathSearchRes,
                    json: true
                })).route.paths
            } catch (error) {
                res.status(400).json({
                    error: MSG.badRequest
                });
            }
        } else {
            try {
                url += "/route?start=" + start + "&end=" + end + "&limit=0";
                pathSearchRes = await (request(url).then(response => JSON.parse(response)));
                url = POINT_SEARCH_URL + "/v2/combined/about?address=" + end;
                pointSearchRes = await (request(url + "&weather=false&bikes=false").then(response => JSON.parse(response)));
                url += "&weather=" + (toDo.weather ? "true" : "false")
                + "&bikes=" + (toDo.bikes ? "true" : "false")
                + (toDo.poi ? arrayToStr(interests,"&interest=",true) : "");
                travel = {
                    start: pointSearchRes,
                    end: await (request(url).then(response => JSON.parse(response))),
                    paths: pathSearchRes.route.paths
                }
            } catch (error) {
                res.status(400).json({
                    error: MSG.badRequest
                });
            }
        }

        res.status(200).json(travel);
    } else {
        res.status(400).json({
            error: MSG.badRequest
        });
    }
};
