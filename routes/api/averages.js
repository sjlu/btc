var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var time = require('../../lib/time');
var moment = require('moment');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  var start = moment(time.getClosestTime(900)).subtract(3, 'day');

  models.Average.findAll({
    where: {
      time: {
        gte: start.valueOf()
      }
    }
  }).then(function(averages) {
    averages = _.chain(averages).groupBy(function(a) {
      return a.time;
    }).map(function(averages, time) {
      var timeObj = {time: time};
      _.each(averages, function(a) {
        timeObj[[a.type,a.granularity,a.depth].join('-')] = a.value;
      });
      return timeObj;
    }).sortBy(function(o) {
      return o.time;
    }).value();

    res.json(averages.slice(averages.length - 50, averages.length));
  }).catch(next);
});

module.exports = router;