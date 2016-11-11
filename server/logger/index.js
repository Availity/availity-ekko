/* eslint no-console:0 */
'use strict';

const chalk = require('chalk');
const dateformat = require('dateformat');
const symbols = require('log-symbols');

class Logger {

  constructor(options) {
    this.options = options;
  }

  static warning(entry) {
    this._log(entry, 'yellow');
  }

  static error(entry) {
    this._log(entry, 'red');
  }

  static info(entry) {
    this._log(entry);
  }

  static failed(entry) {
    this._log(`${symbols.error} ${entry}`, 'red');
  }

  static ok(entry) {
    this._log(`${symbols.success} ${entry}`, 'green');
  }

  static canLog() {
    return process.env.NODE_ENV !== 'testing';
  }

  static _log(entry, _color) {

    if (!this.canLog()) {
      return;
    }

    const now = dateformat(new Date(), 'HH:MM:ss');
    const defaultColor = entry instanceof Error ? 'red' : 'gray';

    const color = _color || defaultColor;

    console.log(`[${ chalk.cyan(now) }] ${ chalk[color](entry) }` );

  }

  static log(entry) {
    this._log(entry);
  }

}

module.exports = Logger;
