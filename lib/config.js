var _ = require('lodash');
var dotenv = require('dotenv');

dotenv.load();

var config = {
  MYSQL_URL: 'mysql://root@localhost/btc'
}

module.exports = _.defaults(process.env, config);
