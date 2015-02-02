var _ = require('lodash');
var moment = require('moment');
var models = require('../lib/models');
var async = require('async');
var winston = require('winston');
var time = require('../lib/time');

module.exports = function(job, done) {
  var granularity = job.data.granularity;
  var numberOfFrames = job.data.frames;

  var framePtr = moment(time.getClosestTime(granularity));
  var count = 0;
  var frames = [];
  while(count < numberOfFrames) {
    var frameStart = moment(framePtr);
    var frameEnd = moment(frameStart).add(granularity, 'seconds');

    frames.push({
      start: frameStart,
      end: frameEnd
    });

    framePtr.subtract(granularity, 'seconds');
    count++;
  }

  async.each(frames, function(frame, cb) {
    models.Trade.findAll({
      where: {
        time: {
          gte: frame.start.valueOf(),
          lt: frame.end.valueOf()
        }
      },
      order: 'time asc'
    }).then(function(trades) {
      // winston.info('creating rate', {
      //   time: frame.start.format('MM/DD/YYYY hh:mm'),
      //   trades: trades.length
      // })

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

      models.Rate.find({
        where: {
          time: frame.start.valueOf(),
          granularity: granularity
        }
      }).then(function(rate) {
        if (!rate) {
          rate = models.Rate.build({
            time: frame.start.valueOf(),
            granularity: granularity
          });
        }

        rate.open = open;
        rate.close = close;
        rate.low = low;
        rate.high = high;
        rate.volume = volume;

        rate.save().then(function(){
          cb();
        }).catch(cb);
      }).catch(cb);
    }).catch(cb);
  }, done);
}