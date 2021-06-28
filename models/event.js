const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
var EventSchema = new Schema({
    EventName: String,
    StartDate: {
        type: Date,
        default: Date.now
    },
    EndDate: {
        type: Date,
        default: Date.now
    },
    FileName: String,
    Link: String,
});

module.exports = mongoose.model("Event", EventSchema);