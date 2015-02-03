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
  }).then(function(trends) {
    async.map(trends, function(trend, cb) {

      models.Trade.findAll({
        where: {
          time: {
            gte: trend.time,
            lt: trend.time + trend.granularity * 1000
          }
        }
      }).then(function(trades) {

        var sum = 0;
        _.each(trades, function(t) {
          sum += t.price;
        });

        trend = trend.toJSON();
        trend.price = sum / trades.length;
        cb(null, trend);
      }).catch(cb);
    }, function(err, trends) {
      if (err) return next(err);
      res.json(trends);
    });


  }).catch(next);
});

module.exports = router;