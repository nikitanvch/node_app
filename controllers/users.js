let User = require("../models/Users");
let Session = require("../models/Sessions");
let List = require("../models/Lists");

let bcrypt = require("bcrypt");
const saltRounds = 10;


const login = async (req, res) => {
    try {
        let currentUser = await new Promise((resolve, reject) => {
            User.findOne({email: req.body.email}, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            })
        });

        if (currentUser) {
            bcrypt.compare(req.body.pw, currentUser.pw, function (err, check) {
                if (check) {
                    console.log("login");
                    var newSession = new Session({
                        user_id: currentUser._id,
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
                    res.status(500).json({
                        "error": "Wrong pw"
                    })
                }
            });
        } else {
            console.log("wrong email");
            res.status(500).json({
                "error": "Wrong email"
            })
        }
    } catch (e) {
        return res.status(500).json({
            "error": "Something was wrong. Please ty again later"
        })
    }
};

const registration = async (req, res) => {
    try {
        let currentUser = await new Promise((resolve, reject) => {
            User.findOne({email: req.body.email}, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            })
        });

        if (currentUser) {
            return res.status(500).json({
                "message": `account with ${data.email} email already exist`
            })

        } else {
            bcrypt.hash(req.body.pw, saltRounds, function (err, hash) {
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
                    console.log("registration");
                    let newSession = new Session({
                        user_id: newUser._id,
                        created_at: curDate(0),
                        updated_at: curDate(0),
                        expires_in: curDate(600),// 10 min
                    });
                    newSession.save(function (err, newSession) {
                        res.status(200).json({
                            "sessionId": `${newSession._id}`,
                        })
                    });
                });
            });
        }
    } catch (e) {
        return res.status(500).json({
            "message": "Something was wrong. Please ty again later"
        });
    }
};

const newList = async (req, res) => {
    try {
        let newList = new List({
            name: req.body.name,
            user_id: req.body.user_id,
        });

        const saveList = await new Promise((resolve, reject) => {
            newList.save(function (err, newList) {
                console.log(err, newList)
                    if (err) reject(err);
                    else resolve(newList);
                }
            )
        });

        if(saveList) {
            console.log("New list created");
            console.log("USER: " + req.body.user_id);
            return  res.status(200).json({'new': 'new'})

        }
    } catch (e) {
        return res.status(500).json({
            "message": "Something was wrong. Please ty again later"
        })
    }
};

const testToken = async (req, res, next) => {
    try {
        let currentSession = await new Promise((resolve, reject) => {
            Session.findOne({_id: req.body.session_id}, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            })
        });

        if (currentSession) {
            if (new Date() < currentSession.expires_in) {
                currentSession.updated_at = curDate(0);
                currentSession.expires_in = curDate(600);// 10 min
                currentSession.save(function (err, data) { });
                req.body.user_id = currentSession.user_id;
                console.log("S");
                next();
            } else {
                res.status(500).json({
                    "message": "Token outdated"
                })
            }
        } else {
            return res.status(503).json({
                "message": "Token undefine"
            });
        }
    } catch (e) { }
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