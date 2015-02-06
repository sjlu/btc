var _ = require('lodash');
var dotenv = require('dotenv');

dotenv.load();

var config = {
  ENV: 'production',
  MYSQL_URL: 'mysql://root@localhost/btc',
  REDIS_URL: 'redis://localhost:6379',
  COINBASE_KEY: '',
  COINBASE_SECRET: '',
  COINBASE_PASSPHRASE: '',
  SESSION_SECRET: 'secret',
  TWILIO_SID: '',
  TWILIO_TOKEN: '',
  TWILIO_NUMBER: '',
  NOTIFY_NUMBER: '+19088215155'
}

module.exports = _.defaults(process.env, config);
