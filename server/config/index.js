'use strict';

const _ = require('lodash');
const argv = require('minimist');

const logger = require('../logger');

const events = {
  START: 'av:started',
  STOPPED: 'av:stopped',
  REQUEST: 'av:request',
  RESPONSE: 'av:response',
  REDIRECT: 'av:redirect',
  FILE_NOT_FOUND: 'av:fileNotFound'
};

class Configuration {

  constructor() {
    this.server = null;
    this.app = null;
    this.router = null;
    this.routes = [];
    this.events = null;
    this.path = null;
    this.addressInUse = null;

    this.constants = {
      EVENTS: events
    };
  }

  /**
   * Set the path of the configuration object
   *
   * @param  {Sring} path full path to configuration. Ex: path.join(__dirname, 'config.js')

   */

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  isTesting() {
    return process.env.NODE_ENV === 'testing';
  }

  defaultConfig(path) {
    return this.path ? require(path) : require('../../config');
  }

  /**
   * Sets the configuration object from the configuration file and command line overrides.
   *
   * @param {Object} options configuration object with production|development|testing settings.
   */
  set(_options) {

    const options = _options || {};

    // Get the config object by path or from root
    if (this.path) {
      logger.info('Loading configuration file {cyan:%s}', this.path);
    }
    let config = this.path ? require(this.path) : this.defaultConfig();

    // Allow programmatic overrides for environment
    config = _.merge(config, options);

    // Pluck out environment specific config and save to `this.options`
    this.environment = process.env.NODE_ENV || 'development';
    this.options = config[this.environment];

    // Merge in any command line overrides
    const args = argv(process.argv.slice(2));

    this.options = _.merge(this.options, args);

  }

  isProxyEnabled() {

    return _.some(this.options.servers, (server) => {
      return server.proxy;
    });

  }
}


module.exports = new Configuration();
