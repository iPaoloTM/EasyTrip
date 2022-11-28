'use strict';

const mongoose = require('mongoose');
const model = require('../models/event');
//const Event = mongoose.model('Event',model);

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

/*module.exports.get_events = (req, res) => {};*/