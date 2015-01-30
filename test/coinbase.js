var assert = require('assert');
var expect = require('chai').expect;

var coinbase = require('../lib/coinbase');

describe('coinbase', function() {
  it('should get some historical data', function(done) {
    coinbase.getHistoricRates(20150128, 3600, function(err, data) {
      expect(err).to.be.null;
      expect(data).to.be.object;
      done();
    })
  });
});