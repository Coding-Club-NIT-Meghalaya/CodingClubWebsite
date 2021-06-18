const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/signup', (req, res) => {
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

router.delete('/user/:id', (req, res) => {
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

router.post('/login', (req, res, next) => {
    console.log(req.body);
    User.find({
        email: req.body.email
    }).exec().then(user => {
        if (user.length < 1) {
            res.render('login');
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    res.render('login');

                } else {
                    if (result) {
                        var token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        }, process.env.JWT_KEY, {
                            expiresIn: '300s',
                        });
                        res.cookie("token", token);
                        res.cookie("name", user[0].firstname)
                        res.render('admin', {
                            name: req.cookies.name,
                        });
                    } else {
                        res.render('login');
                    }
                }
            })
        }
    }).catch(err => {
        res.render('login');
    })

});

module.exports = router