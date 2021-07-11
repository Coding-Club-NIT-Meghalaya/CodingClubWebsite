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
router.get('/blog', function(req, res) {
    Blog.find({
        Status: "published"
    }, (err, obj) => {
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
    if (req.file != undefined)
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
router.post('/update/blog/:id', upload.single('blogImage'), function(req, res) {
    let newData = req.body;
    console.log(req.body);
    console.log(req.body.Status)
    if (req.file != undefined) {
        Blog.findOne({
            _id: req.params.id
        }, (err, obj) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {

                const options = {
                    hostname: 'codingclubnitm.herokuapp.com',
                    path: '/api/v1/image/del/' + req.file.filename,
                    method: 'DELETE'
                }
                const hreq = https.request(options, hres => {
                    console.log(`statusCode: ${hres.statusCode}`)
                    console.log("sucessfull")
                })
                hreq.on('error', error => {
                    console.error(error)
                })
                hreq.end()
            }
        })
        newData["FileName"] = req.file.filename;
    }
    Blog.updateOne({
        _id: req.params.id
    }, {
        $set: newData
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message,
            });
        } else {
            res.status(201).json({
                message: 'Successfull Updated Blog',
            });
        }
    })
});
router.delete('/blog/:id', checkAuth, function(req, res, next) {
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
router.get("/updateblog/:id", (req, res) => {
    Blog.findOne({
        _id: req.params.id
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.render("Admin/Blog Page/updateBlog", {
                arr: obj
            })
        }
    })
});
router.patch("/updateblog/:id", (req, res) => {
    Blog.findOne({
        _id: req.params.id
    }, (err, obj) => {
        var temp_obj = {
            Status: "published"
        };
        if (obj.Status === "published") {
            temp_obj.Status = "in-review";
        }
        Blog.updateOne({
            _id: req.params.id
        }, {
            $set: temp_obj
        }, (err, obj) => {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                res.json({
                    "msg": "Successfully Updated"
                });
            }
        });
    });
});
module.exports = router