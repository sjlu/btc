var express = require('express');
var router = express.Router();
var models = require('../../lib/models');

router.get('/:key', function(req, res, next) {
  models.Trend.findAll({
    where: {
      key: req.params.key
    },
    order: 'time desc'
  }).then(function(trends) {

    res.json(trends);

  }).catch(next);
});

module.exports = router;