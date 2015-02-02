var jobs = require('./lib/jobs');
var async = require('async');
var CronJob = require('cron').CronJob;
var _ = require('lodash');

var calcs = [
  'sma',
  'ema',
  'dema'
];

var rates = [
  60,
  300,
  900
];

var periods = _.range(8,96,8);

// fast, per 3 seconds
new CronJob('*/3 * * * * *', function() {
  async.series([
    function(cb) {
      jobs.create('sync_trades', {}).save(cb);
    },
    function(cb) {
      async.each(rates, function(r, cb) {
        jobs.create('compute_rate', {
          granularity: r,
          frames: 2
        }).save(cb);
      }, cb);
    }
  ])
}, null, true);

// ensure that the past viewable
// frames data are guaranteed accurate
new CronJob('* * */3 * * *', function() {
  async.each(rates, function(r, cb) {
    jobs.create('compute_rate', {
      granularity: r,
      frames: _.max(periods)
    }).save(cb);
  }, cb);
}, null, true);

// compute each average according
// to how frequent we actually need it
_.each(rates, function(r) {
  var minutes = r / 60;
  new CronJob('* */' + minutes + ' * * * *', function() {
    var periods = [];
    _.each(calcs, function(c) {
      _.each(periods, function(p) {
        periods.push([c, p]);
      });
    });

    async.eachSeries(periods, function(rate, cb) {
      jobs.create('compute_average', {
        granularity: r,
        depth: rate[1],
        type: rate[0]
      }).save(cb);
    });
  }, null, true);
});