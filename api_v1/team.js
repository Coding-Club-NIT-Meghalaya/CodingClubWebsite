const express = require('express');
const router = express.Router();
const TeamMember = require('../models/teamMember');
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
router.post("/teammember", checkAuth, upload.single('profileImage'), function(req, res) {
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
router.get("/update/teammember/:id", (req, res, next) => {
    let Foundid = req.params.id;
    TeamMember.findOne({
        _id: Foundid
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                err: err.message,
            });
        } else {
            res.render("Admin/Teams Page/updateTeam", {
                arr: obj,
            });
        }
    });
});
router.post('/update/teammember/:id', upload.single('userImage'), function(req, res) {
    let newData = req.body;
    console.log(req.body);
    if (req.file != undefined) {
        TeamMember.findOne({
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
    TeamMember.updateOne({
        _id: req.params.id
    }, newData, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message,
            });
        } else {
            res.status(201).json({
                message: 'Successfully Updated TeamMember',
            });
        }
    })
});
router.delete('/teammember/:id', checkAuth, function(req, res, next) {
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