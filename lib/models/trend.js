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
    computeDifference: function(averages) {
      if (averages.length < 2) {
        return 0;
      }

      averages = _.sortBy(averages, function(a) {
        return a.value;
      });

      var depthToValue = {};
      _.each(averages, function(a) {
        depthToValue[a.depth] = a.value;
      });
      var depths = _.pluck(averages, "depth");
      var minDepth = _.min(depths);

      var nextDepth = 0;
      if (depths[0] === minDepth) {
        nextDepth = depths[1];
      } else if (depths[depths.length - 1] === minDepth) {
        nextDepth = depths[depths.length - 2];
      } else {
        return 0;
      }

      return (depthToValue[minDepth] - depthToValue[nextDepth]) / depthToValue[minDepth]
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
    },
    type: function() {
      if (this.difference > 0) return "bullish";
      if (this.difference < 0) return "bearish";
    }
  }
});

module.exports = Trend;