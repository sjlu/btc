var schedule = require('node-schedule');
var jobs = require('./lib/jobs');
var async = require('async');

schedule.scheduleJob('* * * * *', function() {
  jobs.create('sync_trades', {}).save();
});

schedule.scheduleJob('*/5 * * * *', function() {
  var rates = [
    [900, 10, 'dema'],
    [900, 25, 'dema'],
    [900, 50, 'dema']
  ];

  async.eachSeries(rates, function(rate, cb) {
    jobs.create('compute_average', {
      granularity: rate[0],
      depth: rate[1],
      type: rate[2]
    }).save(cb);
  })

});