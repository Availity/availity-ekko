var chalk = require('chalk');

var logger = {

  log: function() {
    if(process.env.NODE_ENV === 'testing') {
      return;
    }

    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
  },

  empty: function() {
    this.log('');
  },

  error: function(text) {
    this.log(chalk.red('EKKO %s'), text);
  },

  success: function(text) {
    this.log(chalk.green('EKKO %s'), text);
  },

  warn: function(text) {
    this.log(chalk.yellow('EKKO %s'), text);
  },

  info: function(text) {
    this.log(chalk.gray('EKKO %s'), text);
  },

  fileNotFound: function(file) {
    this.log(chalk.yellow(
      'EKKO file ',
      chalk.cyan('%s'),
      'not found'
    ), file);
  },

  fileFound: function(status, file) {
    this.log(chalk.green(
      'EKKO file',
      chalk.cyan('%s'),
      'return with status',
      chalk.cyan('%s')
    ), status, file);
  },

  start: function(port, mode) {
    this.log(chalk.green(
      'EKKO server started on PORT',
      chalk.cyan('%s'),
      'in',
      chalk.magenta('%s'),
      'mode'
    ), port, mode.toUpperCase());
  },

  url: function(text, url) {
    this.log(chalk.blue(
      'EKKO %s',
      chalk.yellow('[%s]')
    ), text, url);
  }

};

module.exports = logger;
