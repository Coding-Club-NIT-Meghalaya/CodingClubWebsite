const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router.get('/blog', function(req, res) {
    Blog.find((err, obj) => {
        if (err) {
            res.status(500).json({
                err: err.message,
            });
        } else {
            res.status(200).json({
                message: 'Successfull Get Request',
                count: obj.length,
                blog_data: obj,
            });
        }
    }).sort({
        CreatedDate: -1,
    });
});
router.get("/blog/:id", (req, res) => {
    let Foundid = req.params.id;
    Blog.findOne({
        _id: Foundid
    }, (err, obj) => {
        if (err) {
            res.json({
                err: err.message,
            });
        } else {
            res.status(200).json({
                message: 'Successfull Get Request',
                count: obj.length,
                blog_data: obj,
            });
        }
    });
});
router.post("/blog", upload.single('blogImage'), function(req, res) {
    let newData = req.body;
    newData["FileName"] = req.file.filename;
    console.log(newData);
    Blog.create(newData, (err, obj) => {
        if (err) {
            res.json({
                err: err.message,
            });
        } else {
            res.status(201).json({
                message: 'Successfull Post Request',
                count: obj.length,
                blog_data: obj,
            });
        }
    });
});
router.delete('/blog/:id', function(req, res, next) {
    Blog.findOne({
        _id: req.params.id
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                err: err.message
            });
        } else {
            gfs.files.deleteOne({
                filename: obj.FileName
            }, (err, data) => {
                if (err) return res.status(404).json({
                    err: err.message
                });
                else {
                    Blog.deleteOne({
                        _id: req.params.id
                    }, (err, obj) => {
                        if (err) return res.status(404).json({
                            err: err.message
                        });
                        else {
                            res.status(200).json({
                                message: 'Data and Image Sucessfully Deleted',
                            });
                        }
                    });
                }
            });
        }
    });
});
module.exports = router