var jobs = require('./lib/jobs');
var async = require('async');
var CronJob = require('cron').CronJob;
var _ = require('lodash');

var cronJobs = [];

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

var periods = _.range(8,80,8);

// fast, per 12 seconds
cronJobs.push(new CronJob('*/12 * * * * *', function() {
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
}, null, true));

// ensure that the past viewable
// frames data are guaranteed accurate
cronJobs.push(new CronJob('00 */3 * * * *', function() {
  async.each(rates, function(r, cb) {
    jobs.create('compute_rate', {
      granularity: r,
      frames: _.max(periods)
    }).save(cb);
  });
}, null, true));

// compute each average according
// to how frequent we actually need it
_.each(rates, function(r) {
  var minutes = r / 60;
  var cronTime = '00 ';
  if (minutes > 1) {
    cronTime += '*/' + minutes;
  } else {
    cronTime += '*'
  }
  cronTime +=' * * * *';

  cronJobs.push(new CronJob('00 */' + minutes + ' * * * *', function() {
    var periods = [];
    _.each(calcs, function(c) {
      _.each(periods, function(p) {
        periods.push([c, p]);
      });
    });

    async.eachSeries(periods, function(period, cb) {
      jobs.create('compute_average', {
        granularity: r,
        depth: period[1],
        type: period[0]
      }).save(cb);
    });
  }, null, true));
});