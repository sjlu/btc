var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var moment = require('moment');

var Average = sequelize.define('average', {
  time: {
    type: Sequelize.BIGINT,
    unique: 'unique_constraint'
  },
  granularity: {
    type: Sequelize.INTEGER,
    unique: 'unique_constraint'
  },
  depth: {
    type: Sequelize.INTEGER,
    unique: 'unique_constraint'
  },
  type: {
    type: Sequelize.ENUM('sma', 'ema', 'dema', 'tema'),
    allowNull: false,
    unique: 'unique_constraint'
  },
  value: {
    type: Sequelize.DECIMAL(10,2),
    allowNull: false
  }
});

module.exports = Average;