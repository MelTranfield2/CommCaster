var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.body?.trustedData) {
    // has not voted
    res.render('index', { title: 'Express' });
  }
  else {
    res.render('results', { title: 'Express' });
  }
});

router.post('/', async function(req, res, next) {
  console.log(req)
  res.render('results', { title: 'Express' });
});





module.exports = router;
