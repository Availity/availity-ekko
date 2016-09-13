'use strict';

const express = require('express');
const events = require('events');
const http = require('http');
const Promise = require('bluebird');
const chalk = require('chalk');

const logger = require('./logger');
const config = require('./config');
const middleware = require('./middleware');

class Ekko {
  constructor(configPath) {
    this._configPath = configPath;
    config.events = new events.EventEmitter();
  }

  start(options) {

    config.path = this._configPath;
    config.set(options);

    config.app = express();
    config.router = new express.Router();

    middleware.headers();
    if (config.middleware) {
      config.middleware();
    } else {
      middleware.config();
    }

    const port = config.options.servers.web.port || 0;
    config.app.set('port', port);
    config.server = http.createServer(config.app);

    return new Promise((resolve, reject) => {

      config.server.listen(config.options.servers.web.port, () => {

        const url = `http://localhost:${config.server.address().port}`;
        logger.info(`Started ${chalk.yellow('Ekko')} server on ${chalk.green(url)}`);

        config.events.emit(config.constants.EVENTS.START, {
          options: config.options
        });

        resolve(true);

      });

      config.server.on('error', (e) => {

        if (e.errno === 'EADDRINUSE') {
          logger.error('Cannot start server on PORT %s. Check if port is already in use.', config.options.servers.web.port);
        } else {
          logger.error('Failed to start server on PORT %s', config.options.servers.web.port);
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
