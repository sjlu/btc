var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var async = require('async');

router.get('/:key', function(req, res, next) {
  models.Trend.findAll({
    where: {
      key: req.params.key
    },
    order: 'time desc'
  }).then(function(trends) {
    async.map(trends, function(trend, cb) {

      models.Trade.aggregate('price', 'average', {
        where: {
          time: {
            gte: trend.time,
            lt: trend.time + trend.granularity * 1000
          }
        }
      }).then(function(trade) {
        trend = trend.toJSON();
        trend.price = trade.toJSON();
        cb(null, trend);
      }).catch(cb);
    }, function(err, trends) {
      res.json(trends);
    });


  }).catch(next);
});

module.exports = router;