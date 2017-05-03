/**
 * Created by ms_20 on 2017. 5. 3..
 */
var express = require('express');
var router = express.Router();
var CardController = require('../controller/CardController');

/* GET card list. */
router.get('/:email', function(req, res, next) {

    var email= req.params.email;

    console.log('email', email);
    CardController.readCards(email, function (err, result) {
        if (err) {
            return res.json({error: err});
        }

        var response = {};
        response.message = "success";
        response.data = result;

        res.send(response);
    });

});

module.exports = router;
