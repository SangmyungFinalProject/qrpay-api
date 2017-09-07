/**
 * Created by ms_20 on 2017. 5. 9..
 */

var express = require('express');
var router = express.Router();
var PayController = require('../controller/PayController');

router.post('/', function (req, res) {

    var payInfo = {
        card_number: req.body.card_number,
        userId: req.user.userId,
        total_price: Number(req.body.total_price),
        // 현재 시간 정보
        cvc: req.body.cvc
    };

    PayController.chargePay(payInfo, function (err, result) {
        if (err) {
            var errInfo = '';
            errInfo += 'fail,';
            errInfo += err;

            return res.send(errInfo);
        }

        var response = {};
        response.result = true;
        response.message = "success";
        response.data = result;

        res.send(response);
    });
});

router.post('/cancel', function (req, res) {

    var pay_id = req.body.pay_id;

    PayController.cancelPay(pay_id, function (err, result) {
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

router.post('/list', function (req, res) {

    var card_id = req.body.card_id;

    PayController.payList(card_id, function (err, result) {
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

module.exports = router;
