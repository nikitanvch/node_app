var express = require('express'),
    bodyParser = require("body-parser"),
    jsonParser = bodyParser.json(), //?
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

//#region Access-Control-Allow-Origin
// app.options("/*", function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     res.sendStatus(200);
// });

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });
//#endregion

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