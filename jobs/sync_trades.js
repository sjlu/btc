var models = require('../lib/models');

module.exports = function(job, done) {

  models.Trade.find({
    limit: 1,
    order: 'trade_id DESC'
  }).then(function(trade) {
    var startAt = 0;
    if (trade) {
      startAt = trade.trade_id;
    }

  }).error(done);

}