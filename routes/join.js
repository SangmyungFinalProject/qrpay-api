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
        name: req.body.name,
        password: req.body.password
    };

    UserController.insertUser(user, function (err, result) {
        if (err) {
            return res.json({error: err});
        }

        var response = {};
        response.result = true;
        response.message = "success";
        response.data = result;

        res.send(response);
    });
});

router.post('/login', function (req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password
    };

    UserController.readUser(user, function (err, result) {

        if (err) {
            return res.json({error: err});
        }

        var response = {};
        response.result = true;
        response.message = "success";
        response.data = result;

        res.send(response);
    });
});

router.post('/delete', function (req, res) {

    var user_id = req.body.user_id;

    UserController.deleteUser(user_id, function (err, result) {
        if (err) {
            return res.json({error: err});
        }

        var response = {};
        response.result = true;
        response.message = "success";
        response.data = result;

        res.send(response);
    });
});

// login check
router.get('/:email', function (req, res, next) {

    var response = {};
    response.result = true;
    response.message = "success";
    response.data = req.isAuthenticated();

    res.send(response);
});

module.exports = router;
