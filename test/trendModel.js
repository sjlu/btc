var assert = require('assert');
var expect = require('chai').expect;

var models = require('../lib/models');

describe(__filename, function() {
  it('should make a proper key', function() {
    var key = models.Trend.buildKey('dema', 60, [48, 72, 16]);
    expect(key).to.equal('dema-60-16,48,72');
  });
  describe("difference", function() {
    it('should identify negatively', function() {
      var diff = models.Trend.computeDifference([{depth:8,value:1},{depth:16,value:2},{depth:32,value:3}])
      expect(diff).to.be.lessThan(0);
    });
    it('should identify postively', function() {
      var diff = models.Trend.computeDifference([{depth:8,value:3},{depth:16,value:2},{depth:32,value:1}])
      expect(diff).to.be.greaterThan(0);
    });
    it('should identify as zero', function() {
      var diff = models.Trend.computeDifference([{depth:8,value:2},{depth:16,value:1},{depth:32,value:3}])
      expect(diff).to.equal(0);
    });
  })
});