const express = require('express');
const router = express.Router();
const Event = require('../models/event');
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
router.get("/event", function(req, res) {
    Event.find(function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(200).json({
                message: 'Successfull get request',
                count: obj.length,
                event_data: obj,
            });
        }
    }).sort({
        StartDate: -1
    });
});
router.get("/event/:id", (req, res, next) => {
    let Foundid = req.params.id;
    Event.findOne({
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
                event_data: obj,
            });
        }
    });
});
router.post("/event", checkAuth, upload.single('EventPoster'), function(req, res) {
    let newEvent = req.body;
    newEvent["FileName"] = req.file.filename;
    Event.create(newEvent, (err, obj) => {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else
            res.status(201).json({
                message: 'Successfull post request',
                count: obj.length,
                event_data: obj,
            });
    });
});
router.delete('/event/:id', checkAuth, function(req, res, next) {
    Event.findOne({
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
                    Event.deleteOne({
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