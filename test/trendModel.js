var assert = require('assert');
var expect = require('chai').expect;

var models = require('../lib/models');

describe(__filename, function() {
  it('should make a proper key', function(done) {
    var key = models.Trend.buildKey('dema', 60, [48, 72, 16]);
    expect(key).to.equal('dema-60-16,48,72');
    done();
  });

  it('[8,16,32] identify as -1', function(done) {
    var difference = models.Trend.identifyDifference([8,16,32]);
    expect(difference).to.equal(-1);
    done();
  });
  it('[16,8,32] identify as 0', function(done) {
    var difference = models.Trend.identifyDifference([16,8,32]);
    expect(difference).to.equal(0);
    done();
  });
  it('[16,32,8] identify as 1', function(done) {
    var difference = models.Trend.identifyDifference([16,32,8]);
    expect(difference).to.equal(1);
    done();
  });

  it('difference positive', function(done) {
    var difference = models.Trend.identifyDifference([16,32,8], [27, 30, 3]);
    expect(difference).to.equal(0.9);
    done();
  })
    it('difference negative', function(done) {
    var difference = models.Trend.identifyDifference([8,16,32], [3, 30, 33]);
    expect(difference).to.equal(-0.9);
    done();
  })
});