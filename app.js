var express = require('express'),
    bodyParser = require("body-parser"),
    app = express();

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //jsonParser

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function status400(req,res,next) {
    if (!req.body) res.sendStatus(400);
    next();
}
app.use(status400);

var port = process.env.PORT || 3000;
require('./config')(app);

function startServer() {
    app.set('port', port);
    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });
}

startServer();
module.exports = app;