const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check_auth');


//**************   Get Requests***************


router.get('/login', function(req, res) {
    res.render('Admin/Login/login', {
        wrong: 1,
        msg: "",
    });
});
router.get('/changepass', function(req, res) {
    res.render('Admin/Login/changepass', {
        wrong: 1,
        msg: "",
    });
});


//******************** */ Post Requests*******************


router.post('/signup', checkAuth, (req, res) => {
    console.log(req.body);
    User.find({
        email: req.body.email
    }).exec().then(user => {
        if (user.length >= 1) {
            res.status(409).json({
                message: 'User Already exist'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err.message,
                    });
                } else {
                    const obj = new User({
                        email: req.body.email,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        role: req.body.role,
                        password: hash,
                    });
                    obj.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    }).catch(err => {
                        res.status(500).json({
                            error: err.message,
                        })
                    });
                }
            })

        }
    })
});

router.post('/password', (req, res, next) => {

    if (req.body.new_password != req.body.new_password2) {
        res.render('Admin/Login/changepass', {
            wrong: 0,
            msg: "New password not matching in both case",
        })
    }
    console.log(req.body);
    User.find({
        email: req.body.email
    }).exec().then(user => {
        if (user.length < 1) {
            res.render('Admin/Login/changepass', {
                wrong: 0,
                msg: "Entered Password or Email is wrong . Please Try Again!!",
            });
        } else {
            bcrypt.compare(req.body.curr_password, user[0].password, (err, result) => {
                if (err) {
                    res.render('Admin/Login/changepass', {
                        wrong: 0,
                        msg: "Entered Password or Email is wrong . Please Try Again!!",
                    });
                } else {
                    if (result) {
                        bcrypt.hash(req.body.new_password, 10, (err, hash) => {
                            if (err) {
                                res.status(500).json({
                                    error: err.message,
                                });
                            } else {

                                User.updateOne({
                                    email: req.body.email,
                                }, {
                                    password: hash
                                }).then(result => {
                                    res.cookie("token", '');
                                    res.cookie("name", '')
                                    res.cookie("role", '')
                                    console.log(result);
                                    res.render('Admin/Login/login', {
                                        wrong: 0,
                                        msg: "Password Sucessfully Updated .Please Login Again!!"
                                    });

                                }).catch(err => {
                                    res.status(500).json({
                                        error: err.message,
                                    })
                                });
                            }
                        })
                    } else {
                        res.render('Admin/Login/changepass', {
                            wrong: 0,
                            msg: "Entered Password or Email is wrong . Please Try Again!!",
                        });
                    }
                }
            })
        }
    }).catch(err => {
        res.render('Admin/Login/changepass', {
            wrong: 0,
            msg: "Entered Password or Email is wrong . Please Try Again!!",
        });

    })

});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    User.find({
        email: req.body.email
    }).exec().then(user => {
        if (user.length < 1) {
            res.render('Admin/Login/login', {
                wrong: 0,
                msg: "Entered Password or Email is wrong . Please Try Again!!",
            });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    res.render('Admin/Login/login', {
                        wrong: 0,
                        msg: "Entered Password or Email is wrong . Please Try Again!!",
                    });

                } else {
                    if (result) {
                        var token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        }, process.env.JWT_KEY, {
                            expiresIn: '1h',
                        });
                        res.cookie("token", token);
                        res.cookie("name", user[0].firstname)
                        res.cookie("role", user[0].role)
                        res.redirect('/admin');
                    } else {
                        res.render('Admin/Login/login', {
                            wrong: 0,
                            msg: "Entered Password or Email is wrong . Please Try Again!!",
                        });

                    }
                }
            })
        }
    }).catch(err => {
        res.render('Admin/Login/login', {
            wrong: 0,
            msg: "Entered Password or Email is wrong . Please Try Again!!",
        });

    })
});


//************************ */ Delete Requests******************


router.delete('/user/:id', checkAuth, (req, res) => {
    User.deleteOne({
        _id: req.params.id
    }, (err, obj) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.status(200).json({
                message: "User Deleted"
            });
        }
    });
});

module.exports = router