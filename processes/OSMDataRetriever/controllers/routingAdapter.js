'use strict';

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

const profiles = new Set(["car","car_avoid_motorway","car_avoid_toll","small_truck","scooter","foot","hike","bike","mtb","racingbike"])

module.exports.geocode = async (req, res) => {};

module.exports.route = async (req, res) => {};