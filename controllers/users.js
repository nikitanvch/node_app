var User = require('../models/Users');
var Session = require('../models/Sessions');
var List = require('../models/Lists');

var bcrypt = require('bcrypt');
const saltRounds = 10;


function login (req, res) {
    User.findOne({ email: req.body.email }, function (err, data) {
        if (data) {
            bcrypt.compare(req.body.pw, data.pw, function(err, check) {
                if (check == true) {
                    console.log("login")
                    var newSession = new Session({
                        user_id: data._id,
                        created_at: cur_date(0),
                        updated_at: cur_date(0),
                        expires_in: cur_date(600),// 10 min
                    });
                    newSession.save(function (err, newSession) {
                        res.status(200).json({}).end(`${newSession._id}`, 200)
                    });
                } else {
                    console.log("wrong pw")
                    res.end("no", 500)
                }
            });
        } else {
            console.log("wrong email")
            res.end("no", 500)}
        if (err) {
            console.log("Something was wrong. Please ty again later")
            return res.end(`Something was wrong. Please ty again later`, 500)
        }
    });
};

function registration (req, res) {
    User.findOne({ email: req.body.email }, function (err, data) {
        if (data) {
            return res.end(`account with ${data.email} email already exist`, 500)
        }
        if (err) {
            return res.end(`Something was wrong. Please ty again later`, 500)
        }

        bcrypt.hash(req.body.pw, saltRounds, function(err, hash) {
            var newUser = new User({
                email: req.body.email,
                pw: hash,
            });

            newUser.save(function (err, newUser) {
                if (err) {
                    return res.end(`Something was wrong. Please ty again later`, 500)
                }
                res.end("Registration complete!", 200)
            });
        });
    });
};

function new_list (req, res) {
    Session.findOne({_id: req.body.session_id }, function (err, data) {
        var newList = new List({
            name: req.body.name,
            user_id: data.user_id,
        });
        newList.save(function (err, newList) {
            res.end("new list created", 200)
        });
    });
};

function test_token (req, res, next) {
    Session.findOne({_id: req.body.session_id}, function (err, data) {
        if (err) return res.end("token undefine", 503);
        if (new Date() < data.expires_in) {
            data.updated_at = cur_date(0);
            data.expires_in = cur_date(600);// 10 min

            data.save(function (err, data) {
                res.end(`${data._id} session updates ${cur_date(0)}`, 200)
            });

            next();
        } else {
            res.end("token outdated", 500)
        }
    });
}

function cur_date(sec) {
    var date = new Date();
    date.setSeconds(date.getSeconds() + sec);
    return date
}

module.exports = {
    login: login,
    registration: registration,
    new_list: new_list,
    test_token: test_token
}