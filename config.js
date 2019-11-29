module.exports = function (app) {
    let path = require("path"),
        express = require("express"),
        mongoose = require("mongoose"),
        routes = require("./routes/index"),
        users = require("./routes/users");

    app.use(express.static(path.join(__dirname, "public")));

    app.use("/", routes);
    app.use("/users", users);

    app.use(function (req, res, next) {
        let err = new Error("Not Found");
        err.status = 404;
        next(err);
    });

    if (app.get("env") === "development") {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render("error", {
                message: err.message,
                error: err
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: {}
        });
    });

    db = mongoose.createConnection("mongodb://localhost:27017/todo_list", {MongoClient: true});
};