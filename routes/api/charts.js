var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var time = require('../../lib/time');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');

router.get('/price', function(req, res, next) {
  models.Rate.findAll({
    where: {
      granularity: 900
    }
    order: 'time desc',
    limit: 100
  }).then(function(rates) {
    res.json(rates);
  }).catch(next);
})

router.get('/:type/:granularity', function(req, res, next) {
  var type = req.params.type;
  var granularity = req.params.granularity;
  var hoursAgo = req.query.hours || 6;
  var numberOfPoints = req.query.points || 50;

  var start = moment(time.getClosestTime(granularity)).subtract(hoursAgo, 'hours');
  async.parallel({
    averages: function(cb) {
      models.Average.findAll({
        where: {
          type: type,
          granularity: granularity,
          time: {
            gte: start.valueOf()
          }
        }
      }).then(function(averages) {
        cb(null, averages)
      }).catch(cb);
    },
    rates: function(cb) {
      models.Rate.findAll({
        where: {
          granularity: granularity,
          time: {
            gte: start.valueOf()
          }
        }
      }).then(function(rates) {
        cb(null, rates)
      }).catch(cb);
    }
  }, function(err, data) {
    if (err) return next(err);
    var rates = data.rates;
    rates = _.indexBy(rates, function(r) {
      return r.time;
    });

    var averages = data.averages;
    averages = _.chain(averages).groupBy(function(a) {
      return a.time;
    }).map(function(averages, time) {
      var timeObj = {
        time: time,
        close: rates[time].close
      };
      _.each(averages, function(a) {
        timeObj[[a.type,a.granularity,a.depth].join('-')] = a.value;
      });
      return timeObj;
    }).sortBy(function(o) {
      return o.time;
    }).value();

    res.json(averages);

  });
});

module.exports = router;