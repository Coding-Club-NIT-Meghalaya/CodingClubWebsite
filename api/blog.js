const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const upload = require('../multer/gridfs');

router.get('/blog', function(req, res) {
    Blog.find((err, obj) => {
        if (err) {
            res.json({
                'msg': "Some Error Occured"
            });
        } else {
            res.json(obj);
        }
    }).sort({
        CreatedDate: -1,
    });
});
router.get("/blog/:id", (req, res) => {
    let Foundid = req.params.id;
    Blog.findOne({
        _id: Foundid
    }, (err, obj) => {
        if (err) {
            res.json({
                'msg': 'Some Error Occurred'
            });
        } else {
            res.json(obj);
        }
    });
});
router.post("/blog", upload.single('blogImage'), function(req, res) {
    let newData = req.body;
    newData["FileName"] = req.file.filename;
    Blog.create(newData, (err, obj) => {
        if (err) {
            res.json({
                'msg': 'Some Error Occurred'
            });
        } else {
            res.json(obj);
        }
    });
});
module.exports = router