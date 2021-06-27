const express = require('express');
const router = express.Router();
const https = require('https')
const checkAuth = require('../Authentication/middleware/check_auth');


router.get("/addMaterial", checkAuth, function(req, res) {
    res.render("Admin/Resources Page/addMaterial");
});
router.get("/addVideo", checkAuth, function(req, res) {
    res.render("Admin/Resources Page/addVideo");
});

module.exports = router