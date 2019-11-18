var express = require("express");
var cors = require("cors");
var app = express();
var router = express.Router();

var user = require("../controllers/users");

app.use(cors());
/* GET users listing. */
router.get("/", function (req, res, next) {
    res.render("index", {title: "User"});
});

router.post("/login", user.login);

router.post("/registration", user.registration);

router.post("/newList", user.testToken, user.newList);

module.exports = router;
