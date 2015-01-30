var sequelize = require('../sequelize');
var Sequelize = require('sequelize');

var Rate = sequelize.define('rate', {
  time: {
    type: Sequelize.BIGINT
  },
  granularity: {
    type: Sequelize.INTEGER
  },
  low: {
    type: Sequelize.DECIMAL
  },
  high: {
    type: Sequelize.DECIMAL
  },
  open: {
    type: Sequelize.DECIMAL
  },
  close: {
    type: Sequelize.DECIMAL
  },
  volume: {
    type: Sequelize.DECIMAL
  }
});

module.exports = Rate;