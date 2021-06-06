const express = require('express');
const router = express.Router();
const Programming = require('../models/Programming');
const upload = require('../Mongodb/gridfs');

router.get('/programming', function(req, res) {
    Programming.find(function(err, obj) {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else {
            res.json(obj);
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
            res.json({
                'msg': 'Some Error Occurred',
            })
        else {
            res.json(obj);
        }
    })
});
module.exports = router