const express = require('express');
const router = express.Router();
const https = require('https')
const Material = require('../models/material');
const Video = require('../models/video');
const checkAuth = require('../Authentication/middleware/check_auth');


router.get("/addMaterial", checkAuth, function(req, res) {
    res.render("Admin/Resources Page/addMaterial");
});
router.get("/addVideo", checkAuth, function(req, res) {
    res.render("Admin/Resources Page/addVideo");
});
router.get("/resource_manager/:id", checkAuth, function(req, res) {
    if (req.params.id === "Material") {
        Material.find((err, obj) => {
            if (err) {
                res.send({
                    "error": err.message
                });
            } else {
                res.render('Admin/Resources Page/ResourceManager', {
                    obj: obj,
                    id: req.params.id
                });
            }
        });
    } else {
        Video.find((err, obj) => {
            if (err) {
                res.send({
                    "error": err.message
                });
            } else {
                res.render('Admin/Resources Page/ResourceManager', {
                    obj: obj,
                    id: req.params.id
                });
            }
        });

    }

});

module.exports = router