var _ = require('lodash');
var dotenv = require('dotenv');

dotenv.load();

var config = {
  MYSQL_URL: 'mysql://root@localhost/btc',
  COINBASE_KEY: '',
  COINBASE_SECRET: '',
  COINBASE_PASSPHRASE: ''
}

module.exports = _.defaults(process.env, config);
