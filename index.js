var express = require("express");
var app = express();
const path = require('path');
// app.set('view engine', 'html');

// app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", __dirname + "/views"); // set express to look in this folder to render our view
app.get("/", function (req, res) {
  res.render("index");
});
app.get("/events", function (req, res) {
  res.render("Event_2.0/event.html");
});
app.get("/resources", function (req, res) {
  res.render("resource_page/index.html");
});
app.get("/projects", function (req, res) {
  res.render("Project_page/index.html");
});
app.get("/team", function (req, res) {
  res.render("team_page/index.html");
});

const port = 8000;
app.set("port", process.env.port || port); // set express to use this port

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
