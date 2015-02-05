var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var async = require('async');
var _ = require('lodash');

router.get('/:key', function(req, res, next) {
  models.Trend.findAll({
    where: {
      key: req.params.key
    },
    order: 'time desc'
  }).complete(function(err, trends) {
    if (err) return next(err);
    res.json(trends);
  });
});

module.exports = router;