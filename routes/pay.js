/**
 * Created by ms_20 on 2017. 5. 9..
 */

var express = require('express');
var router = express.Router();
var PayController = require('../controller/PayController');

router.post('/', function (req, res) {

    var payInfo = {
        card_id: Number(req.body.card_id),
        item_id: Number(req.body.item_id),
        user_id: Number(req.body.user_id),
        total_price: Number(req.body.total_price)
    };

    var push_token = req.body.push_token;

    PayController.chargePay(payInfo, push_token, function (err, result) {
        if (err) {
            var errInfo = [];
            errInfo[0] = 'fail';
            errInfo[1] = err.errno;

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
