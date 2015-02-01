var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var moment = require('moment');

var Average = sequelize.define('average', {
  time: {
    type: Sequelize.BIGINT,
    unique: 'time_depth_granularity'
  },
  granularity: {
    type: Sequelize.INTEGER,
    unique: 'time_depth_granularity'
  },
  depth: {
    type: Sequelize.INTEGER,
    unique: 'time_depth_granularity'
  },
  type: {
    type: Sequelize.ENUM('sma', 'ema', 'dema', 'tema'),
    allowNull: false
  },
  value: {
    type: Sequelize.DECIMAL(10,2),
    allowNull: false
  }
});

module.exports = Average;