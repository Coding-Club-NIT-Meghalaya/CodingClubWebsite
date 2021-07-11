const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const https = require('https')
const checkAuth = require('../Authentication/middleware/check_auth');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});


router.get("/addBlog", (req, res) => {
    res.render("Admin/Blog Page/addBlog");
});
router.post("/blogmanager", checkAuth, function(req, res) {
    console.log(req.body);
    Blog.find({
        $or: [{
            AuthorName: req.body.Author
        }, {
            Title: req.body.Author
        }]
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {

            res.render("Admin/Blog Page/BlogManager", {
                blogs: obj,
            })

        }
    });
});

router.get("/blogmanager", checkAuth, function(req, res) {

    Blog.find((err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.render("Admin/Blog Page/BlogManager", {
                blogs: obj,
            })
        }
    });

});

router.get("/addUser", checkAuth, function(req, res) {
    res.render("Admin/Login/addUser");
});

module.exports = router