var moment = require('moment');

var roundToNearest = function (value, divisor) {
  return value - (value % divisor);
}

module.exports.getClosestTime = function(granularity) {
  return roundToNearest(moment().valueOf(), granularity * 1000);
}

module.exports.interpretCoinbaseTime = function(iso) {
  return moment(new Date(iso)).valueOf();
}