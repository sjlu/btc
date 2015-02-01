var express = require('express');
var router = express.Router();

router.use('/charts', require('./charts'));

module.exports = router;