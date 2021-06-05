var express = require("express");
var app = express();
const path = require('path');
const crypto = require('crypto');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Grid = require('gridfs-stream');
const db = mongoose.connection;
const port = process.env.PORT || 8000;
require('dotenv').config();
const {
    connected
} = require("process");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
const {
    response
} = require("express");
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let gfs;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("DataBase: We are connected");
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
app.use('/api', require('./api/project'), require('./api/achievement'), require('./api/event'),
    require('./api/programmingEvent'), require('./api/webinarEvent'), require('./api/blog'), require('./api/material'), require('./api/team'), require('./api/video'));

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
app.get('/Image/:filename', (req, res) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        //check if file 
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file Exists'
            });
        }
        //check if image
        if (file.contentType == 'image/jpeg' || file.contentType == 'img/png') {
            //Read output to the browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an Image'
            });
        }
    })
});
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});