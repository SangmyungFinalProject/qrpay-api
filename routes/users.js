var express = require('express');
var router = express.Router();
var UserController = require('../controller/UserController');

router.get('/', function (req, res) {

    UserController.readAllUser(function (err, result) {
        if(err) {
            res.json({error:err});
        } else {
            var response = {};
            response.result = true;
            response.message = "success";
            response.data = result;

            res.send(response);
        }
    });
});

module.exports = router;
