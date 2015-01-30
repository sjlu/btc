var request = require('request');
var config = require('./config');
var crypto = require('crypto');
var moment = require('moment');
var URI = require('URIjs');
var _ = require('lodash');

var coinbaseUrl = 'https://api.exchange.coinbase.com';
var key = Buffer(config.COINBASE_SECRET, 'base64');
var hmac = crypto.createHmac('sha256', key);
var product = 'BTC-USD';

var signRequest = function(timestamp, method, uri, body) {
  method = method.toUpperCase();
  if (body) {
    body = JSON.stringify(body);
  }
  var message = timestamp + method + uri + body;
  return hmac.update(message).digest('base64');
}

var makeRequest = function(method, uri, data, cb) {
  var url = new URI(coinbaseUrl + uri);
  var timestamp = Date.now() / 1000;

  var requestObj = {
    method: method,
    json: true,
  };

  if (data) {
    if (method === 'GET') {
      _.each(data, function(v, k) {
        url.addSearch(k, v);
      });
    } else {
      requestObj.formData = data;
    }
  }

  requestObj.url = url.toString();

  requestObj.headers = {
    'CB-ACCESS-KEY': config.COINBASE_KEY,
    'CB-ACCESS-SIGN': signRequest(timestamp, method, uri, data),
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-PASSPHRASE': config.COINBASE_PASSPHRASE,
    'User-Agent': 'request'
  }

  request(requestObj, function(err, resp, body) {
    if (err) return cb(err);
    switch (resp.statusCode) {
      case 200: break;
      case 400: return cb(new Error('Bad Request - Invalid request format'));
      case 401: return cb(new Error('Unauthorized - Invalid API Key'));
      case 403: return cb(new Error('Forbidden - You do not have access to the requested resource'));
      case 404: return cb(new Error('Not Found'));
      case 500: return cb(new Error('Internal Server Error - We had a problem with our server'));
      default: return cb(new Error('Got an unknown response code - ' + resp.statusCode));
    }
    return cb(null, body);
  });
}

module.exports.getHistoricRates = function(date, granularity, cb) {
  var start = moment(date, 'YYYYMMDD').startOf('day').format();
  var end = moment(start).endOf('day').format();

  makeRequest('GET', '/products/' + product + '/candles', {
    start: start,
    end: end,
    granularity: granularity
  }, cb);
}