'use strict';

const { fetch } = require("../../../common/functions");
const { PROFILES } = require("../../../common/dataStructures");

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

module.exports.geocode = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    let address = req.query.address; //Controlli su Injection
    let limit = req.query.limit;

    if (address != undefined && (limit == undefined || !isNaN(limit))) {
        fetch("https://graphhopper.com/api/1/geocode"
        + "?key=" + process.env.GRAPHHOPPER_KEY
        + "&q=" + address
        + (limit != undefined ? "&limit=" + limit : ""), {
            method: 'GET',
            headers: {
            'Accept': 'application/json'
            }
        }).then(response => response.json()).then(response => res.status(200).json(response))
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
    let i = 0, j;
    if (strPoints != undefined && Array.isArray(strPoints) && strPoints.length >= 2
     && (profile == undefined || PROFILES[profile] != undefined)
     && (shortAnswer == undefined || shortAnswer === 'true' || shortAnswer === 'false')) {
        points = Array(strPoints.length);
        while (right && i < strPoints.length && typeof strPoints[i] == "string") {
            points[i] = strPoints[i].split(",");
            j = 0;
            while (right && j < points[i].length) {
                if (isNaN(points[i][j] = parseFloat(points[i][j]))) {
                    right = false;
                }
                j++;
            }
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