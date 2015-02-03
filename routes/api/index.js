var express = require('express');
var router = express.Router();

router.use('/charts', require('./charts'));
router.use('/trends', require('./trends'));

module.exports = router;