var express = require('express');
var router = express.Router();

const user = require('../controllers/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'User'});
});

router.post('/login', user.login);

router.post('/registration', user.registration);

router.post('/new_list', user.test_token, user.new_list);

router.get('/test-token', user.test_token, user.succsesTest);

module.exports = router;
