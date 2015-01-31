var models = require('../lib/models');
var coinbase = require('../lib/coinbase');
var async = require('async');
var winston = require('../lib/winston');

module.exports = function(job, done) {

  models.Trade.find({
    limit: 1,
    order: 'trade_id DESC'
  }).then(function(trade) {
    var startAt = 0;
    if (trade) {
      startAt = trade.trade_id;
    }
    winston.info('syncing coinbase trades', {
      upTo: startAt
    });
    coinbase.getTrades(startAt, function(err, coinbaseTrades) {
      if (err) return done(err);
      async.each(coinbaseTrades, function(coinbaseTrade, cb) {
        models.Trade.createFromCoinbase(coinbaseTrade, cb);
      }, done);
    });
  }).catch(done);

}