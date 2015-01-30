var sequelize = require('../sequelize');
var Sequelize = require('sequelize');

var Trade = sequelize.define('rate', {
  time: {
    type: Sequelize.BIGINT
  },
  trade_id: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.DECIMAL
  },
  size: {
    type: Sequelize.DECIMAL
  }
});

module.exports = Trade;