const express = require('express');
const router = express.Router();
const Materials = require('../models/material');
const upload = require('../Mongodb/gridfs');

router.get('/material', function(req, res) {
    Materials.find((err, obj) => {
        if (err)
            res.json({
                'msg': "Error Occurred"
            });
        else {
            res.json(obj);
        }
    });
});
router.post("/material", function(req, res) {
    let newData = req.body;
    let getYear = newData.AcademicYear;
    Materials.findOne({
        Year: getYear
    }, function(err, foundData) {
        if (err) {
            res.json({
                'msg': "Error Occurred"
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
                Materials.create(newobj, function(err, newBlog) {
                    if (err) {
                        // alert("Please fill the details correctly");
                        res.json({
                            'msg': "Error Occurred"
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
                        }, null, function(err, docs) {
                            if (err) {
                                res.json({
                                    'msg': "Error Occurred"
                                });
                            } else {
                                console.log("Original Doc : ", docs);
                                res.json(docs);
                            }
                        });
                    }
                });

            } else {
                var str = "Field." + newData.Field + ".Event";
                console.log(str);
                Materials.findOneAndUpdate({
                    Year: getYear
                }, {
                    $push: {
                        [str]: {
                            Link: newData.Link,
                            Name: newData.Name
                        }
                    }
                }, null, function(err, docs) {
                    if (err) {
                        res.json({
                            'msg': "Error Occurred"
                        });
                    } else {
                        res.json(docs);
                    }
                });
            }
        }
    });
});
module.exports = router