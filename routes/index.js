var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var testUrl = 'smartbaedal://api?json=%7B%22func%22%3A%22goPage%22%2C%22arg%22%3A%7B%22page%22%3A%22deliveryservice%22%7D%7D';
  res.redirect(301, testUrl);
});

module.exports = router;
