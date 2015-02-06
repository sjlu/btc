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
  600,
  900,
  1800,
  3600
];

var periods = _.range(8,80,8);

// trade logic
cronJobs.push(new CronJob('00 * * * * *', function() {
  jobs.create('make_actions', {}).save();
}, null, true));

// fast, per 12 seconds
cronJobs.push(new CronJob('0,12,24,36,48 * * * * *', function() {
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

  var combos = [];
  _.each(calcs, function(c) {
    _.each(periods, function(p) {
      combos.push([c, p]);
    });
  });

  cronJobs.push(new CronJob(cronTime, function() {
    async.parallel([
      function(cb) {
        async.eachSeries(combos, function(combo, cb) {
          jobs.create('compute_average', {
            granularity: r,
            depth: combo[1],
            type: combo[0]
          }).save(cb);
        }, cb);
      },
      function(cb) {
        async.eachSeries(calcs, function(c, cb) {
          jobs.create('identify_trends', {
            granularity: r,
            depths: [8, 24, 40],
            algorithm: c
          }).save(cb);
        });
      }
    ]);
  }, null, true));
});
