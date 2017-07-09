/**
 * Created by ms_20 on 2017. 5. 3..
 */
var express = require('express');
var router = express.Router();
var CardController = require('../controller/CardController');

/* GET card list. */
router.get('/:email', function (req, res, next) {

    var email = req.params.email;

    console.log('email', email);
    CardController.readCards(email, function (err, result) {
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
        valid_date: req.body.date,
        type: req.body.type,
        cvc: req.body.cvc
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

module.exports = router;
