const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const checkAuth = require('../Authentication/middleware/check_auth');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router.get("/project", function(req, res) {
    Project.find(function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else
            res.status(200).json({
                message: 'Successfull get request',
                count: obj.length,
                project_data: obj,
            });
    }).sort({
        StartDate: 1
    });
});
router.get("/project/:id", (req, res, next) => {
    let Foundid = req.params.id;
    Project.findOne({
        _id: Foundid
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                err: err.message,
            });
        } else {
            res.status(200).json({
                message: 'Successful Get Request',
                count: obj.length,
                project_data: obj,
            });
        }
    });
});
router.post("/project", checkAuth, upload.single('projectImage'), function(req, res) {
    let data = req.body;
    data["FileName"] = req.file.filename;
    Project.create(data, (err, obj) => {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else
            res.status(201).json({
                message: 'Successfull post request',
                count: obj.length,
                project_data: obj,
            });
    });
});

router.delete('/project/:id', checkAuth, function(req, res, next) {
    Project.findOne({
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
                    Project.deleteOne({
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