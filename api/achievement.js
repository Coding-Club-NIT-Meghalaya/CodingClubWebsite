const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement');
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router.get('/achievement', function(req, res, next) {
    Achievement.find(function(err, obj) {
        if (err)
            res.status(500).json({
                error: {
                    message: "Unsucessfull GET Request",
                    details: err,
                }
            });
        else {
            res.status(200).json({
                message: 'Successful Get Request',
                count: obj.length,
                achievement_data: obj,
            });
        }
    }).sort({
        StartDate: -1,
    });
});
router.get("/achievement/:id", (req, res, next) => {
    let Foundid = req.params.id;
    Achievement.findOne({
        _id: Foundid
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: {
                    message: "Unsucessfull GET Request",
                    details: err,
                }
            });
        } else {
            res.status(200).json({
                message: 'Successful Get Request',
                count: obj.length,
                achievement_data: obj,
            });
        }
    });
});
router.post("/achievement", upload.single('achievementImage'), function(req, res, next) {
    let newAchievement = {
        Name: req.body.Name,
        Date: Date.now(),
        Description: req.body.Description,
        Link: req.body.Link,
        FileName: req.file.filename,
    }
    Achievement.create(newAchievement, (err, obj) => {
        if (err)
            res.json({
                error: {
                    message: "Unsuccessfull POST Request",
                    details: err,
                }
            });
        else
            res.status(201).json({
                message: 'Successfully Created',
                added_achievement: obj,
            });
    });
});
router.delete('/achievement/:id', function(req, res, next) {
    Achievement.findOne({
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
                    Achievement.deleteOne({
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