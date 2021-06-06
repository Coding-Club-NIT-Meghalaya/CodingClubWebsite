var express = require("express");
var app = express();
const path = require('path');
const crypto = require('crypto');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const db = require('./Mongodb/connection');
const port = process.env.PORT || 8000;
require('dotenv').config();
const {
    connected
} = require("process");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const {
    response
} = require("express");
app.use('/api', require('./api/project'), require('./api/achievement'), require('./api/event'),
    require('./api/programmingEvent'), require('./api/images'), require('./api/webinarEvent'), require('./api/blog'), require('./api/material'), require('./api/team'), require('./api/video'));

app.get("/admin/addEvent", function(req, res) {
    res.render("addEvent");
});
app.get("/admin/addAchievement", function(req, res) {
    res.render("addAchievement");
});
app.get("/admin/addProgramming", function(req, res) {
    res.render("addProgramming");
});
app.get("/admin/addWebinar", function(req, res) {
    res.render("addWebinar");
});
app.get("/admin/addBlog", (req, res) => {
    res.render("addBlog");
});
app.get("/admin/addMaterial", function(req, res) {
    res.render("addMaterial");
});
app.get("/admin/addVideo", function(req, res) {
    res.render("addVideo");
});
app.get("/admin/addUser", function(req, res) {
    res.render("addUser");
});
app.get("/admin/addProject", function(req, res) {
    res.render("addProject");
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,PATCH,GET');
        res.status(200).json({});
    }
    next();
});
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});