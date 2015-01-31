var _ = require('lodash');
var moment = require('moment');
var models = require('../lib/models');
var async = require('async');

module.exports = function(job, done) {
  var granularity = 3600;
  var numberOfFrames = job.data.frames;

  var framePtr = moment().startOf('hour').subtract(1, 'hour');
  var count = 0;
  var frames = [];
  while(count < numberOfFrames) {
    var frameStart = moment(framePtr);
    var frameEnd = moment(frameStart).add(granularity, 'seconds');

    frames.push({
      start: frameStart.valueOf(),
      end: frameEnd.valueOf()
    });

    framePtr.subtract(granularity, 'seconds');
    count++;
  }

  async.each(frames, function(frame, cb) {
    models.Trade.findAll({
      where: {
        time: {
          gte: frame.start,
          lt: frame.end
        }
      },
      order: 'time asc'
    }).then(function(trades) {
      var open = _.first(trades).price;
      var close = _.last(trades).price;
      var low = _.min(trades, function(t) {
        return t.price;
      }).price;
      var high = _.max(trades, function(t) {
        return t.price;
      }).price;
      var volume = _.reduce(trades, function(memo, trade) {
        return memo + trade.size;
      }, 0);

      var rate = models.Rate.build({
        time: frame.start,
        granularity: granularity,
        open: open,
        close: close,
        low: low,
        high: high,
        volume: volume
      });

      rate.save().then(function(){
        cb();
      }).catch(cb);
    }).catch(cb);
  }, done);

}