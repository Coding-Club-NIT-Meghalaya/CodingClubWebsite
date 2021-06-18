const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);