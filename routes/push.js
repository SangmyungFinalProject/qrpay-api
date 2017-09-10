/**
 * Created by woowahan on 2017. 9. 2..
 */
var express = require('express');
var router = express.Router();
var PushController = require('../controller/PushController');

/* POST Push Test. */
router.post('/', function(req, res, next) {

    PushController.sendPush(deviceToken, total_price, payId, function(err, result) {

        var response = {};

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

});

module.exports = router;
