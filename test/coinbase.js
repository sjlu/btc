var assert = require('assert');
var expect = require('chai').expect;
var moment = require('moment');

var coinbase = require('../lib/coinbase');

describe(__filename, function() {
  it('should get some historical data', function(done) {
    coinbase.getHistoricRates(20150128, 3600, function(err, data) {
      expect(err).to.be.null;
      expect(data).to.be.object;
      done();
    })
  });

  it('should get some trades', function(done) {
    this.timeout(60000);
    coinbase.getTrades(9007199254740992, function(err, trades) {
      expect(err).to.be.null;
      expect(trades).to.be.object;
      done();
    });
  });

  it('should get the best sell/buy bid', function(done) {
    coinbase.getBestBids(function(err, data) {
      expect(err).to.be.null;
      expect(data).to.be.object;
      done();
    });
  });
});