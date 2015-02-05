var _ = require('lodash');

var analyze = module.exports.analyze = function(numbers) {

  var result = analyzeDeep(numbers);
  if (result === 0) {
    return 0;
  } else if (result > 0) {
    return 1;
  } else (result < 0) {
    return -1;
  }


}

var analyzeDeep = module.exports.analyzeDeep = function(numbers) {

  if (numbers.length < 2) {
    return 0;
  }

  var min = _.min(numbers);
  if (numbers[0] === min) {
    return (numbers[0] - numbers[1]) / numbers[0];
  } else if (numbers[numbers.length - 1] === min) {
    return (numbers[numbers.length - 1] - numbers[numbers.length - 2]) / numbers[numbers.length - 1];
  }

  return 0;

}