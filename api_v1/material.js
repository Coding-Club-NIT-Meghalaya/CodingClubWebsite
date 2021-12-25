const express = require('express');
const router = express.Router();
const Materials = require('../models/material');
const upload = require('../Mongodb/gridfs');
const checkAuth = require('../Authentication/middleware/check_auth');
router.get('/material', function (req, res) {
    Materials.find((err, obj) => {
        if (err)
            res.status(500).json({
                err: err.message,
            });
        else {
            res.status(200).json({
                message: 'Successfull Get Request',
                count: obj.length,
                material_data: obj,
            });
        }
    }).sort({ Year: -1 });
});
router.post("/material", checkAuth, function (req, res) {
    let newData = req.body;
    let getYear = newData.AcademicYear;
    Materials.findOne({
        Year: getYear
    }, function (err, foundData) {
        if (err) {
            res.status(500).json({
                err: err.message,
            });
        } else {
            if (foundData === null) {
                let newobj = {
                    Year: getYear,
                    Field: {
                        Orientation: {
                            Event: [],
                        },
                        Assignment: {
                            Event: [],
                        },
                        Presentation: {
                            Event: [],
                        }
                    }
                }
                Materials.create(newobj, function (err, newBlog) {
                    if (err) {
                        res.status(500).json({
                            err: err.message,
                        });
                    } else {
                        var str = "Field." + newData.Field + ".Event";
                        Materials.findOneAndUpdate({
                            Year: getYear
                        }, {
                            $push: {
                                [str]: {
                                    Link: newData.Link,
                                    Name: newData.Name
                                }
                            }
                        }, null, function (err, docs) {
                            if (err) {
                                res.status(500).json({
                                    err: err.message,
                                });
                            } else {
                                res.status(201).json({
                                    message: 'Successfull Post Request',
                                    count: docs.length,
                                    material_data: docs,
                                });
                            }
                        });
                    }
                });

            } else {
                var str = "Field." + newData.Field + ".Event";
                Materials.findOneAndUpdate({
                    Year: getYear
                }, {
                    $push: {
                        [str]: {
                            Link: newData.Link,
                            Name: newData.Name
                        }
                    }
                }, null, function (err, docs) {
                    if (err) {
                        res.status(500).json({
                            err: err.message,
                        });
                    } else {
                        res.status(201).json({
                            message: 'Successfull Post Request',
                            count: docs.length,
                            material_data: docs,
                        });
                    }
                });
            }
        }
    });
});
module.exports = router