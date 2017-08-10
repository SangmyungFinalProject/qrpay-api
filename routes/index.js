var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var testUrl = 'sbca://categoryCode';
  res.redirect(301, testUrl);
});

module.exports = router;
