var express = require('express');
var events = require('events');
var http = require('http');
var Promise = require('bluebird');

var logger = require('./logger');
var config = require('./config');
var middleware = require('./middleware');

var Ekko = module.exports = function(configPath) {
  this._configPath = configPath;
  config.events = new events.EventEmitter();
};

var proto = Ekko.prototype;

proto.start = function(options) {

  config.path = this._configPath;
  config.set(options);

  config.app = express();
  config.router = new express.Router();

  middleware.headers();

  var environment = process.env.NODE_ENV;
  middleware[environment || 'development']();

  var port = config.options.servers.web.port || 0;
  config.app.set('port', port);
  config.server = http.createServer(config.app);

  return new Promise(function(resolve, reject) {

    config.server.listen(config.options.servers.web.port, function() {

      logger.info('Started mock and proxy server on {green:http://localhost:%s} in {magenta:%s} mode', config.server.address().port, config.environment.toUpperCase());

      config.events.emit(config.constants.EVENTS.START, {
        options: config.options
      });

      resolve(true);

    });

    config.server.on('error', function(e) {

      if (e.errno === 'EADDRINUSE') {
        logger.error('Cannot start server on PORT %s. Check if port is already in use.', config.options.servers.web.port);
      } else {
        logger.error('Failed to start server on PORT %s', config.options.servers.web.port);
      }

      reject(new Error(e));

    });

  });

};

proto.stop = function() {

  return new Promise(function(resolve) {

    if (config.server && config.server.close) {
      config.server.close(function() {
        config.events.emit(config.constants.EVENTS.STOPPED);
        resolve(true);
      });
    } else {
      config.events.emit(config.constants.EVENTS.STOPPED);
      resolve(true);
    }

  });

};

proto.on = function(event, callback) {
  return config.events.on(event, callback);
};

proto.config = function() {
  return config;
};
