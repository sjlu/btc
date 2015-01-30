var assert = require('assert');
var expect = require('chai').expect;
var moment = require('moment');

var coinbase = require('../lib/coinbase');

describe('coinbase', function() {
  it('should get some historical data', function(done) {
    coinbase.getHistoricRates(20150128, 3600, function(err, data) {
      expect(err).to.be.null;
      expect(data).to.be.object;
      done();
    })
  });

  it('should get some trades', function(done) {
    this.timeout(60000);
    coinbase.getTrades(30000, function(err, trades) {
      expect(err).to.be.null;
      expect(trades).to.be.object;
      done();
    });
  })
});