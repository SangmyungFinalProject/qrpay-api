var express = require('express');
var router = express.Router();
var UserController = require('../controller/UserController');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/', function (req, res) {
    var user = {
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password
    };

    UserController.insertUser(user, function(err, result) {
        if (err) {
            return res.json({error: err});
        }

        var response = {};
        response.message = "success";
        response.data = result;

        res.send(response);

    });

});

module.exports = router;