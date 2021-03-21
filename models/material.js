const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
var MaterialSchema = new Schema({
    Year: String,
    Field: {
        Orientation: {
            Event: [],
        },
        Assignment: {
            Event: [],
        },
        Presentation: {
            Event: [],
        },
    }
});

module.exports = mongoose.model("Material", MaterialSchema);