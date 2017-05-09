/**
 * Created by ms_20 on 2017. 5. 9..
 */

var express = require('express');
var router = express.Router();
var PayController = require('../controller/PayController');

router.post('/', function (req, res) {

    var card = {
        //email: req.body.email,
        //name: req.body.name,
        number: req.body.number,
        cvc: req.body.cvc,
        //password: req.body.password,
        //money: req.body.money
        price: req.body.price,
        time: req.body.time,
        company: req.body.company
    };

    PayController.chargePay(card, function (err, result) {
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

    var card = {
        email: req.body.email,
        name: req.body.name,
        number: req.body.number,
        cvc: req.body.cvc,
        password: req.body.password,
        money: req.body.money
    };

    PayController.cancelPay(card, function (err, result) {
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
