var Sequelize = require('sequelize');
var config = require('./config');

module.exports = new Sequelize(config.MYSQL_URL);