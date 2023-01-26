'use strict';

const mongoose = require('mongoose');
const model = require('../models/users');
const User = (mongoose.models && mongoose.models.User) ? mongoose.models.User : mongoose.model('User',model);

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
}

module.exports.saveTrip = async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.status(200).json({
        user: req.loggedUser
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