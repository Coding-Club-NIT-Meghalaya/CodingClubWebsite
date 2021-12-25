const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement');
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const checkAuth = require('../Authentication/middleware/check_auth');
const mongoose = require('mongoose');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router.get('/achievement', function (req, res, next) {
    Achievement.find(function (err, obj) {
        if (err)
            res.status(500).json({
                err: err.message
            });
        else {
            res.status(200).json({
                message: 'Successful Get Request',
                count: obj.length,
                achievement_data: obj,
            });
        }
    }).sort({
        Date: -1,
    });
});
router.get("/achievement/:id", (req, res, next) => {
    let Foundid = req.params.id;
    Achievement.findOne({
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
                achievement_data: obj,
            });
        }
    });
});
router.post("/achievement", checkAuth, upload.single('achievementImage'), function (req, res, next) {
    let newAchievement = {
        Name: req.body.Name,
        Date: Date.now(),
        Description: req.body.Description,
        Link: req.body.Link,
        FileName: req.file.filename,
    }
    console.log(req);
    console.log(req.file);
    Achievement.create(newAchievement, (err, obj) => {
        if (err)
            res.json({
                err: err.message,
            });
        else
            res.status(201).json({
                message: 'Successfully Created',
                added_achievement: obj,
            });
    });
});
router.delete('/achievement/:id', checkAuth, function (req, res, next) {
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
router.get("/update/achievement/:id", (req, res, next) => {
    let Foundid = req.params.id;
    Achievement.findOne({
        _id: Foundid
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                err: err.message,
            });
        } else {
            // let Date = new Date(obj.Date);
            var date = new Date(obj.Date);
            console.log(date);
            var curr_date = date.getDate();

            var curr_month = date.getMonth() + 1;

            var curr_year = date.getFullYear();


            date = curr_year + "-" + curr_month + "-" + curr_date;
            console.log(date);
            res.render("Admin/Events Page/updateAchievement", {
                obj: obj,
                date: date,
            });
        }
    });
});
router.post('/update/achievement/:id', upload.single('achievementImage'), function (req, res) {
    let newData = req.body;
    console.log(req.body);
    if (req.file != undefined) {
        Achievement.findOne({
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
    Achievement.updateOne({
        _id: req.params.id
    }, newData, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message,
            });
        } else {
            res.status(201).json({
                message: 'Successfully Updated Achievement',
            });
        }
    })
});
module.exports = router