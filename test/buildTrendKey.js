var assert = require('assert');
var expect = require('chai').expect;

var models = require('../lib/models');

describe('buildTrendKey', function() {
  it('should make a proper key', function(done) {
    var key = models.Trend.buildKey('dema', 60, [48, 72, 16]);
    expect(key).to.equal('dema-60-16,48,72');
    done();
  });
});