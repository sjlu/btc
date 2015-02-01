var _ = require('lodash');
var dotenv = require('dotenv');

dotenv.load();

var config = {
  MYSQL_URL: 'mysql://root@localhost/btc',
  REDIS_URL: 'redis://localhost:6379',
  COINBASE_KEY: '',
  COINBASE_SECRET: '',
  COINBASE_PASSPHRASE: '',
  SESSION_SECRET: 'secret'
}

module.exports = _.defaults(process.env, config);
