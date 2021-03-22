const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
const achievementSchema = new Schema({
    Name: String,
    Date: {
        type: Date,
        default: Date.now
    },
    Description: String,
    Link: String,
    FileName: String,
});
module.exports = mongoose.model("Achievement", achievementSchema);