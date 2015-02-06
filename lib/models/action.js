var sequelize = require('../sequelize');
var Sequelize = require('sequelize');

var Action = sequelize.define('action', {
  time: {
    type: Sequelize.BIGINT,
    unique: true
  },
  type: {
    type: Sequelize.ENUM('buy', 'sell'),
    allowNull: false
  },
  value: {
    type: Sequelize.DECIMAL(6,2),
    allowNull: false
  }
});

module.exports = Action;