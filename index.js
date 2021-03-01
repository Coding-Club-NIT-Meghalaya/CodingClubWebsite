var express = require("express");
var app = express();
const path = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", __dirname + "/views"); // set express to look in this folder to render our view
app.get("/", function (req, res) {
  res.render("index");
});


app.get("/events", function (req, res) {
  res.render("event");
});
app.get("/resources", function (req, res) {
  res.render("resource");
});
app.get("/projects", function (req, res) {
  res.render("project");
});
app.get("/teams", function (req, res) {
  res.render("team");
});

const port = 8000;
app.set("port", process.env.port || port); // set express to use this port

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
