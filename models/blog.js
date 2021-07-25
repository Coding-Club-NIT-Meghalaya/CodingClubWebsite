const mongoose = require("mongoose");

//Schema setup
const Schema = mongoose.Schema
const blogSchema = new Schema({
    Title: {
        type: String,
        required: true,
    },
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
    Link: {
        type: String,
        default: ""
    },
    FileName: {
        type: String,
        default: "",
    },
    Status: {
        type: String,
        default: "in-review"
    }
});
module.exports = mongoose.model("Blog", blogSchema);