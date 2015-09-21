var dateformat = require('dateformat');
var Logger = require('eazy-logger').Logger;

var template = '[{grey:%s}]} {yellow:[av-ekko]} ';

var logger = new Logger({
  prefix: template.replace('%s', dateformat(new Date(), 'HH:MM:ss')),
  useLevelPrefixes: false
});

module.exports = logger;

