const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const upload = require('../Mongodb/gridfs');

router.get('/video', function(req, res) {
    Video.find((err, obj) => {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(200).json({
                message: 'SUccessfull get request',
                count: obj.length,
                video_data: obj,
            });
        }
    });
});
router.post("/video", function(req, res) {
    let newVideo = req.body;
    Video.create(newVideo, function(err, obj) {
        if (err) {
            res.status(500).json({
                err: err.message,
            });
        } else {
            res.status(201).json({
                message: 'SUccessfull post request',
                count: obj.length,
                video_data: obj,
            });
        }
    });
});
router.delete('/video/:id', function(req, res, next) {
    Video.deleteOne({
        _id: req.params.id
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                err: err.message
            });
        } else {
            res.status(200).json({
                message: 'Data Successfully Deleted'
            });
        }
    });
});

module.exports = router