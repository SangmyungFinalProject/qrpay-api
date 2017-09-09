/**
 * Created by ms_20 on 2017. 5. 9..
 */

var express = require('express');
var router = express.Router();
var PayController = require('../controller/PayController');

router.post('/', function (req, res) {

    req.accepts('application/json');

    var encryptedData = req.body;

    PayController.chargePay(encryptedData, function (err) {
        if (err) {
            var errInfo = '';
            errInfo += 'fail,';
            errInfo += err;

            return res.send(errInfo);
        }

        var result = 'success,0';
        res.send(result);
    });
});

router.post('/cancel', function (req, res) {

    var pay_id = req.body.pay_id;

    PayController.cancelPay(pay_id, function (err) {
        if (err) {
            var errInfo = '';
            errInfo += 'fail,';
            errInfo += err;

            return res.send(errInfo);
        } else {
        var result = 'success,0';
        res.send(result);
        }
    });
});

router.get('/list', function (req, res) {

    PayController.payList(req.user.userId, function (err, result) {
        if (err) {
            return res.json({error: err});
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
