const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
const blogSchema = new Schema({
  Title: String,
  AuthorName: String,
  AuthorEmail: String,
  AuthorLinkedIn: String,
  Category: String,
  Content: String,
  ShortDescription: String,
  Tags: String,
  CreatedDate: {
    type: Date,
    default: Date.now
  },
  Link: String,
  FileName: String,
});
module.exports = mongoose.model("Blog", blogSchema);