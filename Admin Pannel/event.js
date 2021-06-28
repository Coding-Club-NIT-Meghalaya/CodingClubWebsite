const express = require('express');
const router = express.Router();
const https = require('https')
const Event = require('../models/event');
const Webinar = require('../models/Webinar');
const Programming = require('../models/Programming');
const Achievement = require('../models/achievement');
const checkAuth = require('../Authentication/middleware/check_auth');


router.get("/addEvent", checkAuth, function(req, res) {
    res.render("Admin/Events Page/addEvent");
});
router.get("/addAchievement", checkAuth, function(req, res) {
    res.render("Admin/Events Page/addAchievement");
});
router.get("/addProgramming", checkAuth, function(req, res) {
    res.render("Admin/Events Page/addProgramming");
});
router.get("/addWebinar", checkAuth, function(req, res) {
    res.render("Admin/Events Page/addWebinar");
});

router.get("/event_manager", checkAuth, function(req, res) {
    Event.find((err, obj) => {
        if (err) {
            res.send({
                "error": err.message
            });
        } else {
            res.render('Admin/Events Page/EventManager', {
                obj: obj,
                id: 'Event'
            });
        }
    });
});
router.get("/event_manager/:id", function(req, res) {

    if (req.params.id == 'Event') {
        Event.find((err, obj) => {

            if (err) {
                res.send({
                    "error": err.message
                });
            } else {
                res.render('Admin/Events Page/EventManager', {
                    obj: obj,
                    id: req.params.id
                });
            }
        });
    } else if (req.params.id == 'Webinar') {
        Webinar.find((err, obj) => {
            if (err) {
                res.send({
                    "error": err.message
                });
            } else {
                res.render('Admin/Events Page/EventManager', {
                    obj: obj,
                    id: req.params.id
                });
            }
        });
    } else if (req.params.id == 'Programming') {
        Programming.find((err, obj) => {
            if (err) {
                res.send({
                    "error": err.message
                });
            } else {
                res.render('Admin/Events Page/EventManager', {
                    obj: obj,
                    id: req.params.id
                });
            }
        });
    } else {
        Achievement.find((err, obj) => {
            if (err) {
                res.send({
                    "error": err.message
                });
            } else {
                res.render('Admin/Events Page/EventManager', {
                    obj: obj,
                    id: req.params.id
                });
            }
        });
    }
});

module.exports = router