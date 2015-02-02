var Sequelize = require('sequelize');
var config = require('./config');

var opts = {};
if (config.ENV === 'production') {
  sequelizeOpts.logging = false;
}

module.exports = new Sequelize(config.MYSQL_URL, opts);