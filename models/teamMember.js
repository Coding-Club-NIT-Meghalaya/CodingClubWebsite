const mongoose= require("mongoose");

//Schema setup
const Schema = mongoose.Schema
var memberSchema = new Schema({
    FirstName: String,
    LastName: String,
    Designation: Number,
    DesignationName: String,
    Github: String,
    LinkedIn: String,
    Facebook: String,
    filename: String,
  });

  module.exports = mongoose.model("TeamMember", memberSchema);