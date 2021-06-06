const express = require('express');
const router = express.Router();
const Webinar = require('../models/Webinar');
const upload = require('../Mongodb/gridfs');

router.get('/webinar', function(req, res) {
    Webinar.find(function(err, obj) {
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
router.post("/webinar", upload.single('Image'), function(req, res) {
    let newProgEvent = req.body;
    newProgEvent["FileName"] = req.file.filename;
    Webinar.create(newProgEvent, function(err, obj) {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else {
            res.json(obj);
        }
    })
});
module.exports = router