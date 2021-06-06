const express = require('express');
const router = express.Router();
const TeamMember = require('../models/teamMember');
const upload = require('../Mongodb/gridfs');

router.get("/teammember", function(req, res) {
    TeamMember.find(function(err, obj) {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else
            res.json(obj);
    }).sort({
        Designation: 1
    });
});
router.post("/teammember", upload.single('profileImage'), function(req, res) {
    let data = req.body;
    data["filename"] = req.file.filename;
    TeamMember.create(data, (err, obj) => {
        if (err)
            res.json({
                'msg': 'Data Not Uploaded',
            });
        else
            res.json(obj);
    });
});

module.exports = router