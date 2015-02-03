var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var _ = require('lodash');

var Trend = sequelize.define('trend', {
  time: {
    type: Sequelize.BIGINT,
    unique: 'unique_key'
  },
  key: {
    type: Sequelize.STRING,
    unique: 'unique_key'
  },
  type: {
    type: Sequelize.ENUM('buy', 'sell'),
    allowNull: false
  }
}, {
  classMethods: {
    buildKey: function(algo, rate, depths) {
      var key = [];

      rate = ""+rate;

      key.push(algo.toLowerCase());
      key.push(rate.toLowerCase());

      if (!Array.isArray(depths)){
        depths = [depths];
      }
      depths = _.sortBy(depths, function(d) {
        return d;
      });

      key.push(depths.join(','));

      return key.join('-');
    }
  }
});

module.exports = Trend;