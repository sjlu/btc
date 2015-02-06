var twilio = require('twilio');
var config = requrie('./config');
var client = twilio(config.TWILIO_SID, config.TWILIO_TOKEN);

module.exports.sendMessage = function(message, cb) {
  client.sendMessage({
    to: config.NOTIFY_NUMBER,
    from: config.TWILIO_NUMBER,
    body: message
  }, cb);
}