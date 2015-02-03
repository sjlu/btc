var models = require('../lib/models');
var coinbase = require('../lib/coinbase');
var async = require('async');
var winston = require('../lib/winston');
var moment = require('moment');
var _ = require('lodash');
var time = require('../lib/time');

module.exports = function(job, done) {

  models.Trade.find({
    limit: 1,
    order: 'trade_id DESC'
  }).then(function(trade) {
    var startAt = 0;
    if (trade) {
      startAt = trade.trade_id;
    }
    winston.verbose('syncing coinbase trades', {
      upTo: startAt
    });
    coinbase.getTrades(startAt, function(err, coinbaseTrades) {
      if (err) return done(err);
      var formattedTrades = _.map(coinbaseTrades, function(coinbaseTrade) {
        return {
          time: time.interpretCoinbaseTime(coinbaseTrade.time),
          trade_id: coinbaseTrade.trade_id,
          price: coinbaseTrade.price,
          size: coinbaseTrade.size
        }
      });

      models.Trade.bulkCreate(formattedTrades).then(function() {
        done();
      }).catch(done);
    });
  }).catch(done);

}