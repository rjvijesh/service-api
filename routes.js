const mongoose = require('mongoose');
const { mongourl } = require('./config/keys');
const jwt = require("jsonwebtoken");

//require model file User
const User = require('./models/user');

// jwt signing, generating, validating
const { GenerateJWT, ValidateJWT } = require("./auth.js");

//mongo connection
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = (app) => {
    //setting cors policy 
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    function authverify(req, res, next) {
        var output = {};
        if (!/login/.test(req.url) && !/register/.test(req.url)) {
            if (req.method == "OPTIONS") {
                output = { status: 1, msg: "OPTIONS method handled" };
                return res.send(output);
            }
            const authHeader = req.headers.authorization;
            var token = authHeader && authHeader.split(' ')[1];
            if (token == null) {
                output = { status: 101, msg: "token not found" };
                return res.send(output);
            }

            jwtResult = ValidateJWT(token);
            if (jwtResult.Username !== undefined && jwtResult.Username !== '') {
                next();
            } else {
                output = { status: 101, msg: jwtResult.msg, errorName: jwtResult.name };
                res.send(output);
            }
        } else {
            next();
        }
    }

    app.use(authverify);
    app.get('/', (req, res) => {
        User.find({}).then(data => {
            res.send(data);
        });
    });

    app.get('/userprofile/:userid', (req, res) => {
        if (req.params.userid !== '') {
            User.find({ _id: req.params.userid })
                .then(data => {
                    res.send(data);
                });
        }
    });

    app.get('/logout/:userid', (req, res) => {
        var output = {};
        if (req.params.userid !== '') {
            User.updateOne({ _id: req.params.userid }, {
                $set: {
                    "loggedInFlag": 0
                }
            }, function (err, results) {
                if (err) {
                    output = { status: 2, msg: "Logout Fail! LoggedInFlag not updated" };
                    res.send(output);
                    return;
                } else {
                    output = { status: 1, msg: "Logged out successfully" };
                    res.send(output);
                    return;
                }
            })
        }
    });

    app.post('/register', (req, res) => {
        var output = {};
        if (req.body.password !== req.body.confirmpassword) {
            output = { status: 2, msg: "Password Mistmatch!" };
            res.send(output);
            return;
        }
        if (req.body.username !== '') {
            User.find({ username: req.body.username, email: req.body.email })
                .then(data => {
                    if (data !== '' && data.length > 0) {
                        if (data[0].email === req.body.email) {
                            output = { status: 3, msg: "Email Already Exists!" };
                        } else if (data[0].username === req.body.username) {
                            output = { status: 3, msg: "Username Already Exists! Try with a different Username" };
                        }
                        res.send(output);
                        return;
                    }
                });
        }
        const UserDetails = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            status: 1,
            loggedInFlag: 0,
            createdDate: new Date()
        })
        UserDetails.save()
            .then(data => {
                output = { status: 1, msg: "Registration Successful!", data: data };
                res.send(output);
            })
            .catch(err => {
                //throw err;
                output = { status: -1, msg: "Registration Failed!", err: err };
                res.send(output);
            });

    });

    app.post('/login', (req, res) => {
        const claims = {
            Username: req.body.username,
            Password: req.body.password,
        }
        var output = {};
        User.find({ username: req.body.username, password: req.body.password })
            .then(data => {
                if (data !== '' && data.length > 0) {
                    User.updateOne({ _id: data[0]._id }, {
                        $set: {
                            "loggedInFlag": 1
                        }
                    }, function (err, results) {
                        if (err) {
                            output = { status: 2, msg: "Login Fail! LoggedInFlag not updated" };
                            res.send(output);
                            return;
                        } else {
                            const jwtToken = GenerateJWT(claims);
                            output = { status: 1, msg: "Login Successful!", token: jwtToken, data: data };
                            res.send(output);
                        }
                    })


                } else {
                    output = { status: -1, msg: "Login Failed! User does not exist" };
                    res.send(output);
                }
            });
    });

}

