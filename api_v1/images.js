const express = require('express');
const router = express.Router();
const upload = require('../Mongodb/gridfs');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
var FroalaEditor = require('../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor');
let gfs;
db.once('open', () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
});
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        //check if file 
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file Exists'
            });
        }
        //check if image
        if (file.contentType == 'image/jpeg' || file.contentType == 'image/png') {
            //Read output to the browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an Image'
            });
        }
    })
});

router.post('/image_upload', upload.single('file'), function(req, res) {
    var url = "https://codingclubnitm.herokuapp.com/api/v1/image/" + req.file.filename;

    res.send({
        link: url
    });
})
router.post('/image_delete', function(req, res) {
    console.log(req);
    console.log(req);
    res.send("Successfull");
});
router.delete('/image/del/:filename', (req, res) => {
    gfs.files.deleteOne({
        filename: req.params.filename
    }, (err, data) => {

        if (err) {
            console.log(err);

            return res.status(404).json({
                err: err.message
            });
        }
        res.status(200).json({
            message: "File Succesfully Deleted",
        })
    });
});
module.exports = router