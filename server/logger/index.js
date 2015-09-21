var dateformat = require('dateformat');
var Logger = require('eazy-logger').Logger;

Logger.prototype.canLog = function(level) {
  return process.env.NODE_ENV !== 'testing' && this.config.levels[level] >= this.config.levels[this.config.level] && !this._mute;
};

var template = '[{grey:%s}]} {yellow:[av-ekko]} ';

var logger = new Logger({
  prefix: template.replace('%s', dateformat(new Date(), 'HH:MM:ss')),
  useLevelPrefixes: false
});

module.exports = logger;

