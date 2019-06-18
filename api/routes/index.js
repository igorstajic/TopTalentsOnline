let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'TopTalents API is running.' });
});

module.exports = router;
