var models = require('../lib/models');
var moment = require('moment');
var time = require('../lib/time');
var async = require('async');
var _ = require('lodash');
var winston = require('../lib/winston');

module.exports = function(job, done) {

  var depth = parseInt(job.data.depth);
  var granularity = 3600;

  models.Rate.findAll({
    where: {
      granularity: granularity
    },
    order: 'time DESC',
    limit: depth * 2
  }).then(function(rates) {
    async.each(_.range(0, depth), function(i, cb) {
      var time = rates[i].time;

      var sum = 0;
      for (var c = i; c < i + depth; c++) {
        sum += rates[c].close;
      }

      var baseObj = {
        time: time,
        granularity: granularity,
        depth: depth,
        type: 'sma'
      };

      models.Average.find({
        where: baseObj
      }).then(function(average) {
        if (!average) {
          average = models.Average.build(baseObj);
        }

        average.value = sum / depth;

        average.save().then(function() {
          cb();
        }).catch(cb);
      }).catch(cb);
    }, done);
  }).catch(done);

}