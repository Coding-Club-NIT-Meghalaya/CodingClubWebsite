const mongoose= require("mongoose");

//Schema setup
const Schema = mongoose.Schema
const blogSchema = new Schema({
    title: String,
    image: String,
    body: String,
    writtenBy: String,
    created: {
      type: Date,
      default: Date.now
    }
  });
module.exports = mongoose.model("Blog", blogSchema);