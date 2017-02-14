'use strict';

const express = require('express');
const events = require('events');
const http = require('http');
const Promise = require('bluebird');
const chalk = require('chalk');
const logger = require('./logger');
const config = require('./config');
const middleware = require('./middleware');

Promise.config({
  longStackTraces: true
});

class Ekko {

  constructor(ekkoConfig) {

    if (ekkoConfig) {

      const isString = (typeof ekkoConfig === 'string');

      if (isString) {
        this._configPath = ekkoConfig;
      } else {
        this.middleware(ekkoConfig);
      }

    }

    config.events = new events.EventEmitter();
  }

  middleware(options) {
    config.path = this._configPath;
    config.set(options);

    config.app = express();
    config.router = new express.Router();

    middleware.headers();
    middleware.config();

    return config.router;

  }

  start(options) {

    this.middleware(options);

    const port = config.options.port || 0;
    config.app.set('port', port);
    config.server = http.createServer(config.app);

    return new Promise((resolve, reject) => {

      config.server.listen(config.options.port, () => {

        const url = `http://localhost:${config.server.address().port}`;
        logger.getInstance().info(`Ekko server started at ${chalk.green(url)}`);

        config.events.emit(config.constants.EVENTS.START, {
          options: config.options
        });

        resolve(true);

      });

      config.server.on('error', (e) => {

        if (e.errno === 'EADDRINUSE') {
          logger.getInstance().error(`Cannot start Ekko server on PORT ${config.options.port}. Check if port is already in use.`);
        } else {
          logger.getInstance().error(`Failed to start Ekko server on PORT ${config.options.port}`);
        }

        reject(new Error(e));

      });

    });

  }

  stop() {

    return new Promise((resolve) => {

      if (config.server && config.server.close) {
        config.server.close(() => {
          config.events.emit(config.constants.EVENTS.STOPPED);
          resolve(true);
        });
      } else {
        config.events.emit(config.constants.EVENTS.STOPPED);
        resolve(true);
      }

    });

  }

  on(event, callback) {
    return config.events.on(event, callback);
  }

  config() {
    return config;
  }
}

module.exports = Ekko;
