var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var async = require('async');
var _ = require('lodash');
var time = require('../../lib/time');

router.get('/:key', function(req, res, next) {

  var start = moment().subtract(req.query.hoursAgo || 6, 'hours').valueOf();

  models.Trend.findAll({
    where: {
      key: req.params.key,
      time: {
        gte: start
      }
    },
    order: 'time desc'
  }).complete(function(err, trends) {
    if (err) return next(err);
    res.json(trends);
  });
});

module.exports = router;