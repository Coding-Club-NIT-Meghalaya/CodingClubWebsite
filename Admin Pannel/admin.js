const express = require('express');
const router = express.Router();
const https = require('https')
const checkAuth = require('../Authentication/middleware/check_auth');

router.get('/', checkAuth, function(req, res) {
    res.render('Admin/admin', {
        name: req.cookies.name,
        role: req.cookies.role,
    });
});

module.exports = router