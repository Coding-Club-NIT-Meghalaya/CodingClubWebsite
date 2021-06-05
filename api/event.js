const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const upload = require('../multer/gridfs');

router.get("/event", function(req, res) {
    Event.find(function(err, obj) {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else {
            res.json(obj);
        }
    }).sort({
        StartDate: -1
    });
});
router.post("/event", upload.single('EventPoster'), function(req, res) {
    let newEvent = req.body;
    newEvent["FileName"] = req.file.filename;
    Event.create(newEvent, (err, obj) => {
        if (err)
            res.json({
                "msg": "Data Not uploaded"
            });
        else
            res.json(obj);
    });
});
module.exports = router