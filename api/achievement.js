const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement');
const upload = require('../multer/gridfs');

router.get('/achievement', function(req, res) {
    Achievement.find(function(err, obj) {
        if (err)
            res.json({
                'msg': "Some Error Occurred"
            });
        else {
            res.json(obj);
        }
    }).sort({
        StartDate: -1,
    });
});
router.post("/achievement", upload.single('achievementImage'), function(req, res) {
    let newAchievement = req.body;
    newAchievement["FileName"] = req.file.filename;
    Achievement.create(newAchievement, (err, newAchievement) => {
        if (err)
            res.json({
                "msg": "Data Not uploaded"
            });
        else
            res.json(newAchievement);
    });
});
module.exports = router