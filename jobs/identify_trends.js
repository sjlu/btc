var models = require('../lib/models');
var time = require('../lib/time');
var _ = require('lodash');
var async = require('async');
var order = require('../lib/order');
var moment = require('moment');

module.exports = function(job, done) {

  var depths = job.data.depths;
  var granularity = job.data.granularity;
  var algorithm = job.data.algorithm;

  var key = models.Trend.buildKey(algorithm, granularity, depths);
  var end = time.getClosestTime(granularity);
  var start = moment(end).subtract(granularity * _.max(depths), 'seconds');

  async.parallel({
    averages: function(cb) {
      models.Average.findAll({
        where: {
          depth: {
            in: depths
          },
          granularity: granularity,
          type: algorithm,
          time: {
            gte: start.valueOf(),
            lt: end
          }
        }
      }).complete(cb);
    },
    trends: function(cb) {
      models.Trend.findAll({
        where: {
          time: {
            gte: start.valueOf()
          },
          key: key
        }
      }).complete(cb);
    }
  }, function(err, data) {
    if (err) return done(err);

    var groupedAverages = _.groupBy(data.averages, function(a) {
      return a.time;
    });
    var trends = _.indexBy(data.trends, function(t) {
      return t.time;
    });

    var saveThese = [];
    _.each(groupedAverages, function(averages, time) {
      if (averages.length !== depths.length) {
        return;
      }

      averages = _.sortBy(averages, function(a) {
        return a.value;
      });

      var depthOrder = _.pluck(averages, "depth");
      var difference = order.analyzeDeep(depthOrder);

      var action = 'hold';
      if (difference < 0) {
        action = 'sell';
      } else if (difference > 0) {
        action = 'buy';
      }

      var model = trends[time];
      if (!model) {
        model = models.Trend.build({
          time: time,
          key: key
        });
      }

      model.type = action;
      model.difference = difference;

      saveThese.push(model);
    });

    async.each(saveThese, function(m, cb) {
      m.save().complete(cb);
    }, done);
  });


}