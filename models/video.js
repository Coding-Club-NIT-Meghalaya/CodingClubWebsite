const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
const videoSchema = new Schema({
    Title: String,
    Link: String,
});
module.exports = mongoose.model("Video", videoSchema);