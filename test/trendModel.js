var assert = require('assert');
var expect = require('chai').expect;

var models = require('../lib/models');

describe(__filename, function() {
  it('should make a proper key', function() {
    var key = models.Trend.buildKey('dema', 60, [48, 72, 16]);
    expect(key).to.equal('dema-60-16,48,72');
  });

  it('[8,16,32] identify as -1', function() {
    var difference = models.Trend.identifyDifference([8,16,32]);
    expect(difference).to.equal(-1);
  });
  it('[16,8,32] identify as 0', function() {
    var difference = models.Trend.identifyDifference([16,8,32]);
    expect(difference).to.equal(0);
  });
  it('[16,32,8] identify as 1', function() {
    var difference = models.Trend.identifyDifference([16,32,8]);
    expect(difference).to.equal(1);
  });

  it('difference positive', function() {
    var difference = models.Trend.identifyDifference([16,32,8], [27, 30, 3]);
    expect(difference).to.equal(0.9);
  })
  it('difference negative', function() {
    var difference = models.Trend.identifyDifference([8,16,32], [3, 30, 33]);
    expect(difference).to.equal(-0.9);
  })
});