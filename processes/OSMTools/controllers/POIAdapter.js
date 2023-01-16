'use strict';

const { fetch,cleanWrtStruct,strToPoint,pointToStr,arrayToStr,pointArrayToObj } = require("../../../common/functions");
const { AMENITIES,TOURISM,PLACES,INTERESTS } = require('../../../common/dataStructures');

const geolib = require('geolib');

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

module.exports.poi = async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    let interests = Array.isArray(req.query.interest) ? req.query.interest : [req.query.interest];  //topic of search (possible values: amenities or tourism keys)
    let strPoint = req.query.point; //referring point for the search
    let squareSideStr = req.query.squareSide;   //side of square area of search
    
    let right = true;
    let point,squareSide,boundingBoxStr,amenitiesStr,tourismStr;

    if ((interests = cleanWrtStruct(interests,INTERESTS)).length
     && (point = strToPoint(strPoint)) != null) {
        if (squareSideStr == undefined) {
            squareSide = 50000;
        } else {
            right = !isNaN(squareSide = parseFloat(squareSideStr));
        }
    } else {
        right = false;
    }
    if (right) {
        boundingBoxStr = boundingBoxtoStr(point,squareSide);
        amenitiesStr = dictFieldsToStr(interests,AMENITIES);
        tourismStr = dictFieldsToStr(interests,TOURISM);
        queryOverpass("[out:json];("
                        + (amenitiesStr != "" ? "nwr(" + boundingBoxStr + ")[\"addr:city\"][amenity~'^(" + amenitiesStr + ")$'];" : "")
                        + (tourismStr != "" ? "nwr(" + boundingBoxStr + ")[\"addr:city\"][tourism~'^(" + tourismStr + ")$'];" : "")
                        + ");out;")
            .then(response => {
                try {
                    return response.json();
                } catch (error) {
                    return new Promise((resolve,reject) => reject(error))
                }
            }).then(response => res.status(200).json(response))
            .catch(err => {
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
        queryOverpass("[out:json];node(around:" + range + "," + pointToStr(point) + ")[place~'^(" + arrayToStr(PLACES) + ")$'];out;")
            .then(response => response.json())
            .then(response => res.status(200).json(response))
            .catch(err => {
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

function boundingBoxtoStr(point,squareSide) {
    return geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,180).latitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,-90).longitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,0).latitude + ","
            + geolib.computeDestinationPoint(pointArrayToObj(point),squareSide/2,90).longitude;
}

function dictFieldsToStr(fields,dict,sep = "|") {
    
    let res = "";
    for (const field of fields) {
        res += dict[field] != undefined ? sep + arrayToStr(dict[field]) : "";
    }
    
    return res.slice(1);
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