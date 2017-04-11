'use strict';

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = 'ioreg';
var options = ' -l | grep Capacity | cut -d\' \' -f19';

var commandExists = function commandExists(command) {
  return _shelljs2.default.which(command);
};

var get = function get(callback) {
  var battery = {
    currentCapacity: 0,
    originalCapacity: 0,
    health: 0
  };
  if (!commandExists(command)) {
    console.log(command + ' command does not exist');
    callback(battery);
    return;
  }

  _shelljs2.default.exec(command + options, { silent: true }, function (code, stdout, stderr) {
    if (code) {
      console.log('exec error: ' + stderr);
      return null;
    }

    var lines = stdout.match(/[^\n]+/g);
    if (lines === null) {
      console.log('error: ' + stdout);
      callback(battery);
      return;
    }
    var capacityNow = parseInt(lines[0], 10);
    var capacityOriginal = parseInt(lines[3], 10);
    battery = {
      currentCapacity: capacityNow,
      originalCapacity: capacityOriginal,
      health: capacityNow * 100 / capacityOriginal
    };
    callback(battery);
  });
};

module.exports = get;