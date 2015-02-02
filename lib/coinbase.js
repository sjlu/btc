var request = require('request');
var config = require('./config');
var crypto = require('crypto');
var moment = require('moment');
var URI = require('URIjs');
var _ = require('lodash');
var winston = require('winston');
var async = require('async');

var coinbaseUrl = 'https://api.exchange.coinbase.com';
var product = 'BTC-USD';

var signRequest = function(timestamp, method, uri, body) {
  method = method.toUpperCase();
  if (body) {
    body = JSON.stringify(body);
  }
  var message = timestamp + method + uri + body;
  var key = Buffer(config.COINBASE_SECRET, 'base64');
  var hmac = crypto.createHmac('sha256', key);
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
  winston.verbose('making coinbase request', {
    url: requestObj.url
  });

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
    return cb(null, body, resp.headers);
  });
}

module.exports.getHistoricRates = function(date, granularity, cb) {
  var start = moment(date, 'YYYYMMDD').startOf('day');
  var end = moment(start).add(1, 'day').startOf('day');

  makeRequest('GET', '/products/' + product + '/candles', {
    start: start.format(),
    end: end.format(),
    granularity: granularity
  }, function(err, data) {
    if (err) return cb(err);
    data = _.map(data, function(d) {
      return {
        time: d[0],
        low: d[1],
        high: d[2],
        open: d[3],
        close: d[4],
        volume: d[5]
      }
    });
    cb(null, data);
  });
}


var getTradesPaginated = function(since, before, cb) {
  var req = {
    limit: 100
  };

  if (since !== null && before != null) {
    req.before = before;
    req.after = since;
  }

  makeRequest('GET', '/products/' + product + '/trades', req, function(err, data, headers) {
    winston.info('making request', req);
    if (err) return cb(err);
    cb(null, {
      data: data,
      nextPage: headers['cb-after']
    });
  });
}

module.exports.getTrades = function getTrades(since, cb) {

  if (typeof to === "function") {
    cb = to;
    to = null;
  }

  var dataReceived = function(trades) {
    trades = _.chain(trades).sortBy(function(t) {
      return -1*t.trade_id;
    }).uniq(null, function(t) {
      return t.trade_id;
    }).filter(function(t) {
      return t.trade_id > since;
    }).value();

    cb(null, trades);
  }

  getTradesPaginated(since, null, function(err, data) {
    if (err) return cb(err);

    var trades = data.data || [];

    if (data.nextPage <= since) {
      dataReceived(trades);
    } else {
      async.eachLimit(_.range(-1*data.nextPage, -1*since, 100), 5, function(before, cb) {
        getTradesPaginated(since, -1*before, function(err, data) {
          if (err) return cb(err);
          trades = trades.concat(data.data);
          cb();
        });
      }, function(err) {
        if (err) return cb(err);
        dataReceived(trades);
      });
    }
  });

}