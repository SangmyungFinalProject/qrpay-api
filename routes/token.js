/**
 * Created by woowahan on 2017. 9. 2..
 */

var express = require('express');
var router = express.Router();
var TokenController = require('../controller/TokenController');

router.post('/', function(req, res, next) {

    if (req.isAuthenticated()) {

        TokenController.saveToken(req.user.id, req.body.push_token, function (err, result) {

            if (result) {
                response.result = true;
                response.message = "success";
                response.data = result;
            } else {
                response.result = false;
                response.message = err;
            }
            res.send(response);
        });

    } else {

        var response = {};
        response.result = false;
        response.message = "User Authentication fail";

        res.send(response);
    }
});

module.exports = router;
