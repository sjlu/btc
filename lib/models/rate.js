var sequelize = require('../sequelize');
var Sequelize = require('sequelize');

var Rate = sequelize.define('rate', {
  time: {
    type: Sequelize.BIGINT,
    unique: 'time_granularity'
  },
  granularity: {
    type: Sequelize.INTEGER,
    unique: 'time_granularity'
  },
  low: {
    type: Sequelize.DECIMAL(10,2)
  },
  high: {
    type: Sequelize.DECIMAL(10,2)
  },
  open: {
    type: Sequelize.DECIMAL(10,2)
  },
  close: {
    type: Sequelize.DECIMAL(10,2)
  },
  volume: {
    type: Sequelize.DECIMAL(10,6)
  }
});

module.exports = Rate;