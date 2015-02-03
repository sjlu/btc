var _ = require('lodash');

module.exports.analyze = function(numbers) {

  var min = _.min(numbers);
  if (numbers[0] === min) {
    return -1;
  } else if (numbers[numbers.length - 1] === min) {
    return 1;
  }

  return 0;

}