var models = require('../lib/models');
var moment = require('moment');
var time = require('../lib/time');
var async = require('async');
var _ = require('lodash');
var winston = require('../lib/winston');

var averages = {}

var cloneAndFlip = function(rates) {
  rates = _.map(rates, function(r) {
    return r.toJSON();
  })
  rates.reverse();
  return rates;
}

var determinePercent = function(rates) {
  return 2 / (rates.length + 1)
}

var ema = function(percent, value, prevValue) {
  return prevValue + percent * (value - prevValue);
  // return (value * percent) + (prevValue * (1 - percent));
}

var dema = function(ema, emaofema) {
  return 2 * ema - emaofema;
}

averages.sma = function(rates) {
  var sum = 0;
  for (var i = 0; i < rates.length; i++) {
    sum += rates[i].close;
  }
  return sum / rates.length;
}

averages.ema = function(rates) {
  rates = cloneAndFlip(rates);
  var percent = determinePercent(rates);

  var emas = [];
  for (var i = 0; i < rates.length; i++) {
    if (i === 0) {
      emas.push(rates[i].close);
      continue;
    }

    emas.push(ema(percent, rates[i].close, emas[i-1]));
  }

  return _.last(emas);
}

averages.dema = function(rates) {
  rates = cloneAndFlip(rates);
  var percent = determinePercent(rates);

  var emas = []
  var emaofemas = [];
  var demas = [];
  for (var i = 0; i < rates.length; i++) {
    if (i === 0) {
      emas.push(rates[i].close);
      emaofemas.push(rates[i].close);
      demas.push(rates[i].close);
      continue;
    }

    emas.push(ema(percent, rates[i].close, emas[i-1]));
    emaofemas.push(ema(percent, emas[i], emaofemas[i-1]));
    demas.push(dema(emas[i], emaofemas[i]))
  }

  return _.last(demas);
}

module.exports = function(job, done) {

  var depth = parseInt(job.data.depth);
  var granularity = job.data.granularity;
  var type = job.data.type;

  models.Rate.findAll({
    where: {
      granularity: granularity
    },
    order: 'time DESC',
    limit: depth * 2
  }).complete(function(err, rates) {
    if (err) return done(err);
    if (!rates || !rates.length) {
      return done();
    }

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
      }).complete(function(err, average) {
        if (err) return cb(err);
        if (!average) {
          average = models.Average.build(baseObj);
        }

        average.value = value;

        average.save().complete(cb);
      });
    }, done);
  });

}