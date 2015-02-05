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
    type: Sequelize.ENUM('buy', 'sell', 'hold'),
    allowNull: false
  },
  difference: {
    type: Sequelize.DECIMAL(4,4)
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
    },
    identifyDifference: function(numbers, prices) {
      if (prices) {
        if (numbers.length !== prices.length) {
          throw new Error("the length of numbers must equal the numbers of prices")
        }
      }

      if (numbers.length < 2) {
        return 0;
      }

      var min = _.min(numbers);
      if (numbers[0] === min) {
        if (prices) {
          return (prices[0] - prices[1]) / prices[1];
        } else {
          return -1;
        }
      } else if (numbers[numbers.length - 1] === min) {
        if (prices) {
          return (prices[prices.length - 2] - prices[prices.length - 1]) / prices[prices.length - 2];
        } else {
          return 1;
        }
      }

      return 0;
    }
  },
  instanceMethods: {
    interpretKey: function() {
      return this.key.split("-");
    }
  },
  getterMethods: {
    algorithm: function() {
      return this.interpretKey()[0];
    },
    granularity: function() {
      return parseInt(this.interpretKey()[1]);
    },
    depths: function() {
      return this.interpretKey()[2].split(',');
    }
  }
});

module.exports = Trend;