const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../Mongodb/connection');
const Grid = require('gridfs-stream');
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
        if (file.contentType == 'image/jpeg' || file.contentType == 'img/png') {
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
router.delete('/image/del/:filename', (req, res) => {
    gfs.files.deleteOne({
        filename: req.params.filename
    }, (err, data) => {
        if (err) return res.status(404).json({
            err: err.message
        });
        res.status(200).json({
            message: "File Succesfully Deleted",
        })
    });
});
module.exports = router