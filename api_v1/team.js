const express = require('express');
const router = express.Router();
const TeamMember = require('../models/teamMember');
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router.get("/teammember", function(req, res) {
    TeamMember.find(function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else
            res.status(200).json({
                message: 'Succesfull get request',
                count: obj.length,
                team_data: obj,
            });
    }).sort({
        Designation: 1
    });
});
router.get("/teammember/:id", (req, res, next) => {
    let Foundid = req.params.id;
    TeamMember.findOne({
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
                Team_data: obj,
            });
        }
    });
});
router.post("/teammember", upload.single('profileImage'), function(req, res) {
    let data = req.body;
    data["filename"] = req.file.filename;
    TeamMember.create(data, (err, obj) => {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else
            res.status(201).json({
                message: 'Succesfull post request',
                count: obj.length,
                team_data: obj,
            });
    });
});
router.delete('/teamMember/:id', function(req, res, next) {
    TeamMember.findOne({
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
                    TeamMember.deleteOne({
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