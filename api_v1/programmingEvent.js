const express = require('express');
const router = express.Router();
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const Programming = require('../models/Programming');
const checkAuth = require('../Authentication/middleware/check_auth');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router
router.get('/programming', function(req, res) {
    Programming.find(function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(200).json({
                message: 'Successfull get request',
                count: obj.length,
                programming_data: obj,
            });
        }
    }).sort({
        StartDate: -1,
    });
});
router.post("/programming", checkAuth, upload.single('Image'), function(req, res) {
    let newProgEvent = req.body;
    console.log(newProgEvent);
    newProgEvent["FileName"] = req.file.filename;
    Programming.create(newProgEvent, function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            })
        else {
            res.status(201).json({
                message: 'Successfull post request',
                count: obj.length,
                programming_data: obj,
            });
        }
    });
});

router.delete('/programming/:id', checkAuth, function(req, res, next) {
    Programming.findOne({
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
                    Programming.deleteOne({
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