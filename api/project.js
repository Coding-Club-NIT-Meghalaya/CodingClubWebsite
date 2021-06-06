const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const upload = require('../Mongodb/gridfs');

router.get("/project", function(req, res) {
    Project.find(function(err, obj) {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else
            res.json(obj);
    }).sort({
        StartDate: 1
    });
});
router.post("/project", upload.single('projectImage'), function(req, res) {
    let data = req.body;
    data["FileName"] = req.file.filename;
    Project.create(data, (err, obj) => {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else
            res.json(obj);
    });
});
module.exports = router