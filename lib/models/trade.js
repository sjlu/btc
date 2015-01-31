var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var moment = require('moment');

var Trade = sequelize.define('trade', {
  time: {
    type: Sequelize.BIGINT
  },
  trade_id: {
    type: Sequelize.INTEGER,
    unique: true
  },
  price: {
    type: Sequelize.DECIMAL(10,2)
  },
  size: {
    type: Sequelize.DECIMAL(10,6)
  }
}, {
  classMethods: {
    createFromCoinbase: function(coinbaseTrade, cb) {
      var trade = this.build({
        time: moment(coinbaseTrade.time).valueOf(),
        trade_id: coinbaseTrade.trade_id,
        price: coinbaseTrade.price,
        size: coinbaseTrade.size
      });

      trade.save().then(function(trade) {
        cb(null, trade);
      }).catch(cb);
    }
  }
});

module.exports = Trade;