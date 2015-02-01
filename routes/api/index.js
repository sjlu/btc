var express = require('express');
var router = express.Router();

router.use('/averages', require('./averages'));

module.exports = router;