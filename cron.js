var schedule = require('node-schedule');
var jobs = require('./lib/jobs');
var async = require('async');

schedule.scheduleJob('* * * * *', function() {
  async.parallel([
    function(cb) {
      jobs.create('sync_trades', {}).save(cb);
    },
    function(cb) {
      jobs.create('compute_rate', {
        granularity: 900,
        frames: 100
      }).save(cb);
    }
  ])
});

schedule.scheduleJob('1,16,31,46 * * * *', function() {
  var rates = [
    [900, 8, 'dema'],
    [900, 16, 'dema'],
    [900, 24, 'dema'],
    [900, 32, 'dema'],
    [900, 40, 'dema'],
    [900, 48, 'dema'],
    [900, 56, 'dema'],
    [900, 64, 'dema'],
    [900, 72, 'dema'],
    [900, 80, 'dema'],
    [900, 88, 'dema'],
    [900, 96, 'dema'],
  ];

  async.eachSeries(rates, function(rate, cb) {
    jobs.create('compute_average', {
      granularity: rate[0],
      depth: rate[1],
      type: rate[2]
    }).save(cb);
  })

});