var models = require('../lib/models');
var moment = require('moment');
var time = require('../lib/time');
var async = require('async');
var _ = require('lodash');
var winston = require('../lib/winston');

var averages = {}

averages.sma = function(rates) {
  var sum = 0;
  for (var i = 0; i < rates.length; i++) {
    sum += rates[i].close;
  }
  return i / rates.length;
}

averages.ema = function(rates) {
  rates = _.map(rates, function(r) {
    return r.toJSON();
  })
  rates.reverse();

  var percent = 2 / (rates.length + 1);

  var emas = [];
  for (var i = 0; i < rates.length; i++) {
    if (i === 0) {
      emas.push(rates[i].close);
      continue;
    }

    console.log(rates[i]);

    emas.push((rates[i].close * percent) + (emas[i - 1] * (1 - percent)));
  }

  return _.last(emas);
}

module.exports = function(job, done) {

  var depth = parseInt(job.data.depth);
  var granularity = 3600;
  var type = 'ema';

  models.Rate.findAll({
    where: {
      granularity: granularity
    },
    order: 'time DESC',
    limit: depth * 2
  }).then(function(rates) {
    async.each(_.range(0, depth), function(i, cb) {
      var time = rates[i].time;

      var averageFunc = averages[type];
      var value = averageFunc(rates.slice(i, i + depth));

      var baseObj = {
        time: time,
        granularity: granularity,
        depth: depth,
        type: type
      };

      models.Average.find({
        where: baseObj
      }).then(function(average) {
        if (!average) {
          average = models.Average.build(baseObj);
        }

        average.value = value;

        average.save().then(function() {
          cb();
        }).catch(cb);
      }).catch(cb);
    }, done);
  }).catch(done);

}