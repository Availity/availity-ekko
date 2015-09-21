var express = require('express');
var http = require('http');
var BPromise = require('bluebird');

var logger = require('./logger');
var config = require('./config');
var middleware = require('./middleware');

var Ekko = module.exports = function(configPath) {
  this._configPath = configPath;
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

  return new BPromise(function(resolve, reject) {

    config.server.listen(config.options.servers.web.port, function() {

      logger.start(config.server.address().port, config.environment);

      resolve(true);

    });

    config.server.on('error', function(e) {

      if (e.errno === 'EADDRINUSE') {
        logger.error('Cannot start server on PORT ' + config.options.servers.web.port + '. Check if port is already in use.');
      }else {
        logger.error('Failed to start server on PORT ' + config.options.servers.web.port);
      }

      reject(new Error(e));

    });

  });

};

proto.stop = function() {

  return new BPromise(function(resolve) {

    if (config.server  && config.server.close) {
      config.server.close(function() {
        resolve(true);
      });
    }else {
      resolve(true);
    }

  });

};

proto.config = function() {
  return config;
};
