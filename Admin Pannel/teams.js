const express = require('express');
const router = express.Router();
const teamMember = require('../models/teamMember');
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

router.get("/teammanager", checkAuth, function(req, res) {

    teamMember.find((err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.render("Admin/Teams Page/TeamManager", {
                obj: obj,
            })
        }
    });
});
router.post("/teammanager", checkAuth, function(req, res) {
    console.log(req.body);
    Team.find({
        $or: [{
            FirstName: req.body.firstname
        }, {
            DesignationName: req.body.firstname
        }]
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            console.log(obj);
            res.render("Admin/Teams Page/TeamManager", {
                obj: obj,
            })

        }
    });
});
router.get("/addteammember", function(req, res) {
    res.render("Admin/Teams Page/addteammember")

});
module.exports = router