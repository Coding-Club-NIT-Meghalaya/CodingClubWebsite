const express = require('express');
const router = express.Router();
const Webinar = require('../models/Webinar');
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
router.get('/webinar', function(req, res) {
    Webinar.find(function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(200).json({
                message: 'Successful Get Request',
                count: obj.length,
                webinar_data: obj,
            });
        }
    }).sort({
        StartDate: -1,
    });
});
router.get("/webinar/:id", (req, res, next) => {
    let Foundid = req.params.id;
    Webinar.findOne({
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
                webinar_data: obj,
            });
        }
    });
});
router.post("/webinar", checkAuth, upload.single('Image'), function(req, res) {
    let newProgEvent = req.body;
    newProgEvent["FileName"] = req.file.filename;
    Webinar.create(newProgEvent, function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(201).json({
                message: 'Successful post Request',
                count: obj.length,
                webinar_data: obj,
            });
        }
    })
});
router.delete('/webinar/:id', checkAuth, function(req, res, next) {
    Webinar.findOne({
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
                    Webinar.deleteOne({
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