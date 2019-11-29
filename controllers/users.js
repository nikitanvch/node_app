let User = require("../models/Users");
let Session = require("../models/Sessions");
let List = require("../models/Lists");

let bcrypt = require("bcrypt");
const saltRounds = 10;


function login (req, res) {
    User.findOne({ email: req.body.email }, function (err, data) {
        if (data) {
            bcrypt.compare(req.body.pw, data.pw, function(err, check) {
                if (check === true) {
                    console.log("login");
                    var newSession = new Session({
                        user_id: data._id,
                        created_at: curDate(0),
                        updated_at: curDate(0),
                        expires_in: curDate(600),// 10 min
                    });
                    newSession.save(function (err, newSession) {
                        res.status(200).json({
                            "sessionId": `${newSession._id}`
                        })
                    });
                } else {
                    console.log("wrong pw");
                    res.status(500).json({
                        "error": "Wrong pw"
                    })
                }
            });
        } else {
            console.log("wrong email");
            res.status(500).json({
                error: "Wrong email"
            })
        }
        if (err) {
            console.log("Something was wrong. Please ty again later");
            return res.status(500).json({
                "error": "Something was wrong. Please ty again later"
            })
        }
    });
};

const registration =  async (req, res) => {
    // let  CurrentUser = await  User.findOne({ email: req.body.email });
    // console.log(CurrentUser)
    User.findOne({ email: req.body.email }, function (err, data) {
        if (data) {
            return res.status(500).json({
                "message": `account with ${data.email} email already exist`
            })
        }
        if (err) {
            return res.status(500).json({
                "message": "Something was wrong. Please ty again later"
            })
        }

        bcrypt.hash(req.body.pw, saltRounds, function(err, hash) {
            let newUser = new User({
                email: req.body.email,
                pw: hash,
            });

            newUser.save(function (err, newUser) {
                if (err) {
                    return res.status(500).json({
                        "message": "Something was wrong. Please ty again later"
                    })
                }
                res.status(200).json({
                    "message": "Registration complete!"
                })
            });
        });
    });
};

function newList (req, res) {
    Session.findOne({_id: req.body.session_id }, function (err, data) {
        if (err) {
            return res.status(500).json({
                "message": "Something was wrong. Please ty again later"
            })
        }

        let newList = new List({
            name: req.body.name,
            user_id: data.user_id,
        });

        newList.save(function (err, newList) {
            if (err) {
                return res.status(500).json({
                    "message": "Something was wrong. Please ty again later"
                })
            }
            res.status(200).json({
                "message": "New list created"
            })
        });
    });
};

function testToken (req, res, next) {
    Session.findOne({_id: req.body.session_id}, function (err, data) {
        if (err) return res.end("token undefine", 503);
        if (new Date() < data.expires_in) {
            data.updated_at = curDate(0);
            data.expires_in = curDate(600);// 10 min

            data.save(function (err, data) {
                res.end(`${data._id} session updates ${curDate(0)}`, 200)
            });

            next(data.user_id);
        } else {
            res.end("token outdated", 500)
        }
    });
}

function curDate(sec) {
    let date = new Date();
    date.setSeconds(date.getSeconds() + sec);
    return date
}

module.exports = {
    login: login,
    registration: registration,
    newList: newList,
    testToken: testToken
}