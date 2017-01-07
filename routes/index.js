var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/host', function(req, res, next) {
  res.render('host', { title: 'Express' });
});

module.exports = router;
