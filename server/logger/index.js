'use strict';

const dateformat = require('dateformat');
const Logger = require('eazy-logger').Logger;

Logger.prototype.canLog = function(level) {
  return process.env.NODE_ENV !== 'testing' && this.config.levels[level] >= this.config.levels[this.config.level] && !this._mute;
};

const template = '[{grey:%s}]} {yellow:[av-ekko]} ';

const logger = new Logger({
  prefix: template.replace('%s', dateformat(new Date(), 'HH:MM:ss')),
  useLevelPrefixes: false
});

module.exports = logger;

