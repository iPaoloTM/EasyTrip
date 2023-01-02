const path = require("path");
const fs = require('fs');
const mongoose = require('mongoose');
var convertJsonSchemaToMongoose = require("convert-json-schema-to-mongoose")

const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname,"./es.schema.json")));

const UserSchema = new mongoose.Schema(convertJsonSchemaToMongoose.createMongooseSchema({}, schema));

UserSchema.index({"uuid": "text"},{unique: true})

module.exports = UserSchema;