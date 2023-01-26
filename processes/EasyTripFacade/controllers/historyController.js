'use strict';

const uuid = require('uuid');
const url = require('url');
const mongoose = require('mongoose');
const model = require('../models/users');
const User = (mongoose.models && mongoose.models.User) ? mongoose.models.User : mongoose.model('User',model);

const { INTERESTS, PROFILES, POINT_SEARCH_URL, PATH_SEARCH_URL } = require('../../../common/dataStructures');
const { cleanWrtStruct, arrayToStr } = require('../../../common/functions');

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
}

module.exports.saveTrip = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

        const obj = JSON.parse(req.body);
        const urlString = obj.url;

        User.findById(req.loggedUser.user_id, (err, user) => {
          if (err) {
              //console.log(err);
              res.status(500).json({
                  error: MSG.serverError
              });
          } else {

            const parsedUrl = url.parse(urlString);

            const pathname = parsedUrl.pathname;

            const type = pathname.split('/')[3];

            const params = new URLSearchParams(parsedUrl.search);

            const isSafe = true;

            if (type == 'travel') {

              if (params.weather != "true" || params.weather != "false" || params.bikes != "true" || params.bikes != "false" || interests = cleanWrtStruct(interests,INTERESTS)).length == 0) {
                isSafe = false;
              }

            } else if (type == 'destination') {
              if (params.weather != "true" || params.weather != "false" || params.bikes != "true" || params.bikes != "false" || interests = cleanWrtStruct(interests,INTERESTS)).length == 0 || params.limit < 0 || params.limit > 8 || typeof params.minDistance != "number" || typeof params.maxDetour != "number") {
                isSafe = false;
              }
            }

            if (isSafe) {

            const date = new Date().toISOString();

            const id = uuid.v4();

            const historyObject = JSON.stringify(Object.fromEntries('{"id":"'+id+'", "dateTime": "'+date+'", "type": "'+type+'", "parameters": "'+params+'", "url": "'+url+'"}'));
            console.log(historyObject);

            user.history.push(historyObject);
            user.save((err, updatedUser) => {
                if(err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).json(updatedUser);
                }
            }); } else {
              res.status(500).json({
                  error: MSG.serverError
              });
            }
        }
    });

}

module.exports.getTrips = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const strLimit = req.query.limit;
    const strOffset = req.query.offset;

    let history = {};
    let mergedHistory;
    User.findById(req.loggedUser.user_id,{_id: 0, history: 1},(err,docs) => {
        if (err) {
            //console.log(err);
            res.status(500).json({
                error: MSG.serverError
            });
        } else {
            mergedHistory = docs.history;
            mergedHistory.sort((a,b) => {
                let dateA = new Date(a.dateTime);
                let dateB = new Date(b.dateTime);
                return dateA < dateB ? 1 : (dateA > dateB ? -1 : 0);
            });
            for (const trip of mergedHistory) {
                if (history[trip.type] == undefined) {
                    history[trip.type] = [trip];
                } else {
                    history[trip.type].push(trip);
                }
            }
            for (const type of Object.keys(history)) {
                history[type] = cut(history[type],strOffset,strLimit);
            }
            res.status(200).json({
                history: history
            });
        }
    });
}

module.exports.deleteTrip = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const id = req.params.id;

    User.findByIdAndUpdate(req.loggedUser.user_id,{
        $pull: {
            history: {id: id},
        }
    },(err,doc) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: MSG.serverError
            });
        } else {
            res.sendStatus(200);
        }
    });
}

function cut(array,strOffset,strLimit) {

    let tmpN;
    let arrayLength = array.length;
    let offset = (strOffset != undefined && !isNaN(tmpN = parseInt(strOffset)) && tmpN >= 0 && tmpN < arrayLength) ? tmpN : 0;
    let limit = (strLimit != undefined && !isNaN(tmpN = parseInt(strLimit)) && tmpN > 0 && (offset + tmpN) <= arrayLength) ? tmpN : arrayLength-offset;
    if (offset != 0 || limit != arrayLength) {
        array = array.slice(offset,offset+limit);
    }

    return array;
}
