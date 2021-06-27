const express = require('express');
const router = express.Router();
const https = require('https')
const checkAuth = require('../Authentication/middleware/check_auth');


router.get("/addProject", checkAuth, function(req, res) {
    res.render("Admin/Projects Page/addProject");
});

module.exports = router