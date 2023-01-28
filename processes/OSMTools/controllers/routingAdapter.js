'use strict';

const { fetch, strToPoint, pointObjCompleteNames, pointArrayToObj, parseBoolean } = require("../../../common/functions");
const { PROFILES } = require("../../../common/dataStructures");

const geolib = require('geolib');

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
    notFound: "Data not found", //Error code: 404
}

module.exports.geocode = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    let address = req.query.address; //Controlli su Injection
    let limit = req.query.limit;
    let closestToStr = req.query.closestTo;
    let onlyPlacesStr = req.query.onlyPlaces;

    let onlyPlaces = false;
    let closest = {
        details: undefined,
        dist: Number.MAX_SAFE_INTEGER
    };
    let closestPlace = {
        details: undefined,
        dist: Number.MAX_SAFE_INTEGER
    };
    let closestTo,currentDist;
    if (address != undefined
            && (limit == undefined || !isNaN(limit))
            && (closestToStr == undefined || (closestTo = pointArrayToObj(strToPoint(closestToStr))) != null)
            && (onlyPlacesStr == undefined || closestTo != undefined && (onlyPlaces = parseBoolean(onlyPlacesStr)) != null)) {
        fetch("https://graphhopper.com/api/1/geocode"
        + "?key=" + process.env.GRAPHHOPPER_KEY
        + "&q=" + address
        + (limit != undefined ? "&limit=" + limit : ""), {
            method: 'GET',
            headers: {
            'Accept': 'application/json'
            }
        }).then(response => response.json()).then(response => {
            if (Array.isArray(response.hits) && response.hits.length > 0) {
                if (closestTo != undefined) {
                    for (const result of response.hits) {
                        currentDist = geolib.getDistance(closestTo,pointObjCompleteNames(result.point));
                        if (currentDist < closest.dist) {
                            closest.dist = currentDist;
                            closest.details = result;
                        }
                        if (onlyPlaces && result.osm_key == "place" && currentDist < closestPlace.dist) {
                            closestPlace.dist = currentDist;
                            closestPlace.details = result;
                        }
                    }
                    res.status(200).json({
                        hits: [onlyPlaces && closestPlace.details != undefined ? closestPlace.details : closest.details]
                    });
                } else {
                    res.status(200).json(response);
                }
            } else {
                res.status(404).json({
                    error: MSG.notFound
                });
            }
        })
        .catch(err => {
            //console.error(err);
            res.status(400).json({
                error: MSG.badRequest
            });
        });
    } else {
        res.status(400).json({
            error: MSG.badRequest
        });
    }
};

module.exports.route = async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    let strPoints = req.query.point;
    let profile = req.query.profile;
    let shortAnswer = req.query.shortAnswer;
    
    let right = true;
    let points;
    let i = 0;
    if (strPoints != undefined && Array.isArray(strPoints) && strPoints.length >= 2
     && (profile == undefined || PROFILES[profile] != undefined)
     && (shortAnswer == undefined || shortAnswer === 'true' || shortAnswer === 'false')) {
        points = Array(strPoints.length);
        while (right && i < strPoints.length && typeof strPoints[i] == "string") {
            points[i] = strToPoint(strPoints[i]);
            right = points[i] != null;
            i++;
        }
    } else {
        right = false;
    }

    if (right) {
        fetch("https://graphhopper.com/api/1/route"
        + "?key=" + process.env.GRAPHHOPPER_KEY
        + strPoints.reduce((p,c) => p += "&point=" + c,"")
        + (profile != undefined ? "&profile=" + profile : "")
        + (shortAnswer === 'true' ? "&instructions=false&calc_points=false" : "&points_encoded=false"), {
            method: 'GET',
            headers: {
            'Accept': 'application/json'
            }
        }).then(response => response.json()).then(response => res.status(200).json(response))
        .catch(err => {
            console.error(err);
            res.status(400).json({
                error: MSG.badRequest
            });
        });
    } else {
        res.status(400).json({
            error: MSG.badRequest
        });
    }
};