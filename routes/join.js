var express = require('express');
var router = express.Router();
var UserController = require('../controller/UserController');
var passport = require('../app').passport;

/* failureRedirect */
router.get('/', function (req, res, next) {
    var error = 'failureRedirect';

    var response = {};
    response.result = false;
    response.message = "fail";
    response.data = error;

    res.send(response);
});

router.post('/', passport.authenticate('local-signup', {
    failureRedirect: '/'
}), function (req, res) {
    var response = {};
    response.result = true;
    response.message = "success";
    response.data = req.user;

    res.send(response);
});

router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/'
}), function (req, res) {
    var response = {};
    response.result = true;
    response.message = "success";
    response.data = req.user;

    res.send(response);
});

router.post('/delete', function (req, res) {

    var userId = req.user.userId;

    UserController.deleteUser(userId, function (err, result) {
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
