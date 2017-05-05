var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    var response = {};
    response.result = true;
    response.message = "success";
    response.data = 'result';

    res.send(response);
});

module.exports = router;
