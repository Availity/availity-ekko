var chalk = require('chalk');
var argv = require('minimist');
var dateformat = require('dateformat');

var logger = {

  prefix: function() {
    var time = '['+chalk.grey(dateformat(new Date(), 'HH:MM:ss'))+'] '+ chalk.grey('EKKO');
    process.stdout.write(time + ' - ');
  },

  log: function() {

    if(process.env.NODE_ENV === 'testing' && !argv.verbose) {
      return;
    }

    var args = Array.prototype.slice.call(arguments);
    this.prefix();
    console.log.apply(console, args);
  },

  empty: function() {
    this.log('');
  },

  error: function(text) {
    this.prefix();
    console.log(chalk.red('%s'), text);
  },

  success: function(text) {
    this.log(chalk.green('%s'), text);
  },

  warn: function(text) {
    this.log(chalk.yellow('%s'), text);
  },

  info: function(text) {
    this.log(chalk.gray('%s'), text);
  },

  fileNotFound: function(file) {
    this.log(chalk.yellow(
      'File ',
      chalk.cyan('%s'),
      'not found'
    ), file);
  },

  fileFound: function(status, file) {
    this.log(chalk.green(
      'File',
      chalk.cyan('%s'),
      'return with status',
      chalk.cyan('%s')
    ), status, file);
  },

  start: function(port, mode) {
    this.log(
      chalk.grey('Started',
        chalk.green('http://localhost:'+port),
        'in',
        chalk.magenta('%s'),
        'mode'
      ), mode.toUpperCase());
  },

  url: function(text, url) {
    this.log(chalk.blue(
      '%s',
      chalk.yellow('[%s]')
    ), text, url);
  }

};

module.exports = logger;
