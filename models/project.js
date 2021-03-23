const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
var ProjectSchema = new Schema({
  Name: String,
  Field: String, //like web,app etc
  Status: String, //ongoing/completed etc.
  StartDate: {
    type: Date,
    default: Date.now
  },
  EndDate: {
    type: Date,
    default: Date.now
  },
  ShortDescription: String,
  Description: String,
  Github: String,
  Link: String,
  FileName: String
});

module.exports = mongoose.model("Project", ProjectSchema);