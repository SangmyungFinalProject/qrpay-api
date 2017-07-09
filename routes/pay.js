/**
 * Created by ms_20 on 2017. 5. 9..
 */

var express = require('express');
var router = express.Router();
var PayController = require('../controller/PayController');

router.post('/', function (req, res) {

    var ID = {
        card_id: req.body.card_id,
        item_id: req.body.item_id,
        user_id: req.body.user_id
    };

    var pay = {
        price_of_all: req.body.price_of_all,
        time_of_pay: req.body.time_of_pay
    };

    PayController.chargePay(ID, pay, function (err, result) {
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
