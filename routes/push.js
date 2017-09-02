/**
 * Created by woowahan on 2017. 9. 2..
 */
var express = require('express');
var router = express.Router();

/* POST Push Test. */
router.post('/', function(req, res, next) {

    var title = 'push test';
    var contents = 'contents';
    var deviceToken = req.body.token;

    // push server request


    res.send("ok");


});

module.exports = router;
