'use strict';

const geolib = require('geolib');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const amenities = {
    Sustenance: ["bar","biergarten","cafe","fast_food","food_court","ice_cream","pub","restaurant"],
    Education: ["college","driving_school","kindergarten","language_school","library","toy_library","training","music_school","school","university"],
    Entertainment: ["arts_centre","casino","cinema","community_centre","conference_centre","events_venue","fountain","planetarium","public_bookcase","social_centre","studio","theatre"]
}

module.exports.poi = async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    let topic = req.query.topic;
    let strPoint = req.query.point;
    let squareSideStr = req.query.squareSide;
    
    let right = true;
    let point, squareSide;
    let i = 0;
    if (amenities[topic] != undefined
     && strPoint != undefined) {
        if (squareSideStr == undefined) {
            squareSide = 50000;
        } else {
            right = isNan(squareSide = parseFloat(squareSideStr));
        }
        if (right) {
            point = strPoint.split(",");
            while (right && i < point.length) {
                if (isNaN(point[i] = parseFloat(point[i]))) {
                    right = false;
                }
                i++;
            }
        }
    } else {
        right = false;
    }
    if (right) {
        fetch("https://www.overpass-api.de/api/interpreter?", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: "[out:json];nwr(" + boundingBoxtoStr(point,squareSide) + ")[amenity~'^(" + amenitiesToStr(topic) + ")'];out;"
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

function boundingBoxtoStr(point,squareSide) {
    return geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,180).latitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,-90).longitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,0).latitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,90).longitude;
}

function amenitiesToStr(topic) {
    
    let res = amenities[topic][0];
    for (let i = 1; i < amenities[topic].length; i++) {
        res += "|" + amenities[topic][i];
    }
    
    return res;
}

function pointArrayToObj(point) {
    return {
        latitude: point[0],
        longitude: point[1]
    }
}

function pointObjToArray(point) {
    return [point.latitude,point.longitude];
}