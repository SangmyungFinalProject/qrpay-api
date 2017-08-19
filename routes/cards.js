/**
 * Created by ms_20 on 2017. 5. 3..
 */
var express = require('express');
var router = express.Router();
var CardController = require('../controller/CardController');

/* GET card list. */
router.get('/:userId', function (req, res, next) {

    var userId = req.params.userId;

    console.log('userId', userId);
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

router.get('/', function (req, res, next) {

    console.log('get user : ', req.user.user_id);

    CardController.readCards(req.user.user_id, function (err, result) {
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

    var card = {
        number: req.body.number,
        cvc: req.body.cvc,
        valid_date: req.body.date,
        type: req.body.type,
        company: req.body.company
    };

    var userId = req.body.userId;

    CardController.createCard(card, userId, function (err, result) {
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

router.post('/delete', function (req, res) {

    var card_id = req.body.card_id;

    CardController.deleteCard(card_id, function (err, result) {
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

    var card_id = req.body.card_id;

    var card = {
        number: req.body.number,
        cvc: req.body.cvc,
        valid_date: req.body.date,
        type: req.body.type
    };

    CardController.updateCard(card, card_id, function (err, result) {
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
