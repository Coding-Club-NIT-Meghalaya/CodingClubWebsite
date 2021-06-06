const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const upload = require('../Mongodb/gridfs');

router.get('/video', function(req, res) {
    Video.find((err, obj) => {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else {
            res.json(obj);
        }
    });
});
router.post("/video", function(req, res) {
    let newVideo = req.body;
    Video.create(newVideo, function(err, obj) {
        if (err) {
            res.json({
                'msg': "Error Occurred"
            });
        } else {
            res.json(obj);
        }
    });
});

module.exports = router