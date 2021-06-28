const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
var ProgrammingSchema = new Schema({
    Title: String,
    StartDate: {
        type: Date,
        default: Date.now
    },
    EndDate: {
        type: Date,
        default: Date.now
    },
    Time: String,
    ShortDescription: String,
    RegistrationLink: String,
    Link: String,
    FileName: String
});

module.exports = mongoose.model("Programming", ProgrammingSchema);