var assert = require('assert');
var expect = require('chai').expect;

var time = require('../lib/time');
var moment = require('moment');

describe(__filename, function() {
  it('should get the correcct time string', function(done) {
    var utc = time.interpretCoinbaseTime('2015-02-03 03:42:58.870371+00');
    expect(utc).to.equal(1422934978870);
    done();
  });

  it('should get the closest time possible', function() {
    var someTime = time.getClosestTime(1800);
    expect(someTime).to.be.at.least(moment().valueOf() - 1800000);
  });
});