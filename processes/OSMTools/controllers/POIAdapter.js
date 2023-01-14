'use strict';

const geolib = require('geolib');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const AMENITIES = {
    Sustenance: ["bar","biergarten","cafe","fast_food","food_court","ice_cream","pub","restaurant"],
    Education: ["college","driving_school","kindergarten","language_school","library","toy_library","training","music_school","school","university"],
    Entertainment: ["arts_centre","casino","cinema","community_centre","conference_centre","events_venue","fountain","planetarium","public_bookcase","social_centre","studio","theatre"]
}

const PLACES = ["city","town","village","hamlet"];

module.exports.poi = async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    let topics = Array.isArray(req.query.topic) ? req.query.topic : [req.query.topic];  //topic of search (possible values: amenities keys)
    let strPoint = req.query.point; //referring point for the search
    let squareSideStr = req.query.squareSide;   //side of square area of search
    
    let right = true;
    let point, squareSide;
    let i = topics.length;
    while (i--) {
        if (AMENITIES[topics[i]] == undefined) {
            topics.splice(i, 1);
        }
    }
    if (topics.length
     && (point = strToPoint(strPoint)) != null) {
        if (squareSideStr == undefined) {
            squareSide = 50000;
        } else {
            right = isNan(squareSide = parseFloat(squareSideStr));
        }
    } else {
        right = false;
    }
    if (right) {
        queryOverpass("[out:json];nwr(" + boundingBoxtoStr(point,squareSide) + ")[amenity~'^(" + amenitiesToStr(topics) + ")$'];out;")
            .then(response => response.json()).then(response => res.status(200).json(response))
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

module.exports.nearbyCities = async (req, res) => {

    let strPoint = req.query.point; //referring point for the search
    let range = req.query.range != undefined ? req.query.range : 5000; //range of search

    let point;
    if ((point = strToPoint(strPoint)) != null) {
        console.log("[out:json];node(around:" + range + "," + pointToString(point) + ")[place~'^(" + arrayToStr(PLACES) + ")$'];out;");
        queryOverpass("[out:json];node(around:" + range + "," + pointToString(point) + ")[place~'^(" + arrayToStr(PLACES) + ")$'];out;")
            .then(response => response.json()).then(response => res.status(200).json(response))
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
}

function strToPoint(strPoint) {
    
    let point;
    let right = strPoint != undefined;
    let i = 0;

    if (right) {
        point = strPoint.split(",");
        while (right && i < point.length) {
            if (isNaN(point[i] = parseFloat(point[i]))) {
                right = false;
            }
            i++;
        }
    }

    return right ? point : null;
}

function boundingBoxtoStr(point,squareSide) {
    return geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,180).latitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,-90).longitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,0).latitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,90).longitude;
}

function pointToString(point) {
    
    let res = "";

    if (Array.isArray(point)) {
        res = point[0] + "," + point[1];
    } else {
        res = point.latitude + "," + point.longitude;
    }

    return res;
}

function arrayToStr(array,sep = "|") {
    
    let res = array[0] != undefined ? array[0] : "";
    
    for (let i = 1; i < array.length; i++) {
        res += sep + array[i];
    }

    return res;
}

function amenitiesToStr(topics) {
    
    let res = "";
    for (const topic of topics) {
        res += "|" + arrayToStr(AMENITIES[topic]);;
    }
    
    return res.slice(1);
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

function queryOverpass(query) {
    return fetch("https://www.overpass-api.de/api/interpreter?", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: query
    })
}