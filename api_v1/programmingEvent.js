const express = require('express');
const router = express.Router();
const Programming = require('../models/Programming');
const upload = require('../Mongodb/gridfs');

router.get('/programming', function(req, res) {
    Programming.find(function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(200).json({
                message: 'Successfull get request',
                count: obj.length,
                programming_data: obj,
            });
        }
    }).sort({
        StartDate: -1,
    });
});
router.post("/programming", upload.single('Image'), function(req, res) {
    let newProgEvent = req.body;
    console.log(newProgEvent);
    newProgEvent["FileName"] = req.file.filename;
    Programming.create(newProgEvent, function(err, obj) {
        if (err)
            res.status(500).json({
                err: err.message,
            })
        else {
            res.status(201).json({
                message: 'Successfull post request',
                count: obj.length,
                programming_data: obj,
            });
        }
    });
});
module.exports = router