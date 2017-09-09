/**
 * Created by ms_20 on 2017. 5. 3..
 */
var express = require('express');
var router = express.Router();
var CardController = require('../controller/CardController');

router.get('/', function (req, res, next) {

    if(!req.isAuthenticated()) {
        console.log('error!');

        var error = 'sign in fail';
        var response = {};
        response.result = false;
        response.message = "Sing-in fail";
        response.date = error;

        return res.send(response);
    }

    var userId = req.user.userId;

    console.log('userId::', userId);
    CardController.readCards(userId, function (err, result) {
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

router.post('/', function (req, res) {

    if(!req.isAuthenticated()) {
        console.log('error!');

        var error = 'sign in fail';
        var response = {};
        response.result = false;
        response.message = "fail";
        response.date = error;

        return res.send(response);
    }

    var card = {
        number: req.body.number,
        cvc: req.body.cvc,
        valid_date: req.body.date,
        type: req.body.type,
        company: Number(req.body.company),
        bounds: Number(0)
    };

    var userId = req.user.userId;

    CardController.createCard(card, userId, function (err, result) {
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

router.post('/delete', function (req, res) {

    var cardId = req.body.cardId;

    CardController.deleteCard(cardId, function (err, result) {
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

router.post('/update', function (req, res) {

    var cardId = req.body.cardId;

    var card = {
        number: req.body.number,
        cvc: req.body.cvc,
        valid_date: req.body.date,
        type: req.body.type
    };

    CardController.updateCard(card, cardId, function (err, result) {
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
