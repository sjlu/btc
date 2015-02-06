var models = require('../lib/models');
var async = require('async');
var coinbase = require('../lib/coinbase');
var _ = require('lodash');
var twilio = require('../lib/twilio');
var winston = require('../lib/winston');
var moment = require('moment');

module.exports = function(job, done) {

  var timeStart = moment().valueOf();

  async.waterfall([
    function(cb) {
      models.Action.find({
        order: 'time desc'
      }).done(cb);
    },
    function(action, cb) {
      action = action || {
        time: 0,
        type: 'sell'
      }

      var where = {
        time: {
          gte: action.time
        },
        key: {
          in: ['dema-600-8,24,40']
        }
      };

      if (action.type === 'buy') {
        where.difference = {
          lte: -0.0002
        };
        action = 'sell';
      } else {
        where.difference = {
          gte: 0.0002
        }
        action = 'buy';
      }

      models.Trend.findAll({
        where: where,
        order: 'time desc'
      }).done(function(err, trends) {
        if (err) return cb(err);
        cb(null, trends, action)
      });
    },
    function(trends, action, cb) {
      if (!trends || !trends.length) {
        return cb(true);
      }

      var trendTimesByKey = {};
      _.each(trends, function(t) {
        if (!trendTimesByKey[t.key]) {
          trendTimesByKey[t.key] = [];
        }
        trendTimesByKey[t.key].push(t.time)
      });

      var noAction = false;
      _.each(trendTimesByKey, function(times, k) {
        k = k.split('-');
        var rate = parseInt(k[1]);

        if (times[0] - (rate * 1000) !== times[1]) {
          noAction = true;
        }
      });

      if (noAction) {
        return cb(true); // stop here
      }

      cb(null, action);
    },
    function(action, cb) {
      coinbase.getBestBids(function(err, bids) {
        if (err) return cb(err);
        cb(null, action, bids);
      })
    },
    function(action, bids, cb) {
      models.Action.create({
        time: timeStart,
        type: action,
        value: (bids.buy + bids.sell) / 2
      }).done(cb);
    },
    function(action, cb) {
      var message = [
        moment(action.time).format('MM/DD hh:mma'),
        action.type.toUpperCase(),
        '$' + action.value
      ];
      twilio.sendMessage(message.join(" "), cb);
    }
  ], function(err) {
    if (err && err !== true) return done(err);
    done();
  });

}