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
      }).success(function(averages) {
        cb(null, averages);
      }).error(cb);
    },
    trends: function(cb) {
      models.Trend.findAll({
        where: {
          time: {
            gte: start.valueOf()
          },
          key: key
        }
      }).success(function(trends) {
        cb(null, trends);
      }).error(cb);
    }
  }, function(err, data) {
    if (err) return done(err);

    var averages = _.groupBy(data.averages, function(a) {
      return a.time;
    });
    var trends = _.indexBy(data.trends, function(t) {
      return t.time;
    });

    var analyzedAverages = _.chain(averages).map(function(a, time) {
      a = _.chain(a).sortBy(function(a) {
        return a.value;
      }).pluck("depth").value();

      return {
        time: time,
        order: a
      };
    }).sortBy(function(t) {
      return t.time;
    }).value();

    var sequence = [];
    var times = [];
    for (var i = 0; i < analyzedAverages.length; i++) {
      sequence.push(order.analyze(analyzedAverages[i].order));
      times.push(analyzedAverages[i].time);
    }

    var update = [];
    var create = [];
    for (var i = 1; i < sequence.length; i++) {
      var prev = sequence[i - 1];
      var curr = sequence[i];

      if (prev !== curr && curr !== 0) {
        var type = 'buy';
        if (curr < prev) {
          type = 'sell';
        }

        var time = times[i];

        if (trends[time]) {
          var model = trends[time];
          model.type = type;
          update.push(model);
          delete times[time];
        } else {
          create.push(models.Trend.build({
            time: time,
            key: key,
            type: type
          }));
        }
      }
    }

    async.parallel([
      function(cb) {
        if (!update || !update.length) {
          return cb();
        }

        async.each(update, function(m, cb) {
          m.save().then(function() {
            cb();
          }).catch(cb);
        }, cb);
      },
      function(cb) {
        if (!create || !create.length) {
          return cb();
        }

        async.each(create, function(m, cb) {
          m.save().then(function() {
            cb()
          }).catch(cb);
        }, cb);
      },
      function(cb) {
        var remove = _.values(trends);
        if (!remove || !remove.length) {
          return cb();
        }

        async.each(remove, function(m, cb) {
          m.destroy().then(function() {
            cb();
          }).catch(cb);
        }, cb);
      }
    ], done);
  });


}