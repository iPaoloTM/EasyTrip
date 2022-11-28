const path = require("path");
const fs = require('fs');
const mongoose = require('mongoose');
var convertJsonSchemaToMongoose = require("convert-json-schema-to-mongoose")

/*const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname,"")));

const EventSchema = new mongoose.Schema(convertJsonSchemaToMongoose.createMongooseSchema({}, schema));

EventSchema.index({"uuid": "text"},{unique: true})

module.exports = EventSchema;*/