var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');
var Sequelize = require('../lib/sequelize');

router.get('/:key', function(req, res, next) {

  var start = moment().subtract(req.query.hoursAgo || 6, 'hours').valueOf();
  var threshold = req.query.threshold;

  models.Trend.findAll({
    where:
      Sequelize.and({
        key: req.params.key,
        time: {
          gte: start
        }
      }, Sequelize.or({
        difference: {
          gte: threshold
        },
      }, {
        difference: {
          lte: -1*threshold
        }
      })
    },
    order: 'time desc'
  }).complete(function(err, trends) {
    if (err) return next(err);
    res.json(trends);
  });
});

module.exports = router;