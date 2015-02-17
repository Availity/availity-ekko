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

  config.path(this._configPath);
  config.set(options);

  config.app = express();
  config.router = express.Router();

  middleware.headers();

  var environment = process.env.NODE_ENV;
  middleware[environment || 'development']();

  config.app.set('port', config.options.servers.web.port);
  config.server = http.createServer(config.app);

  return new BPromise(function (resolve, reject) {

    config.server.listen(config.options.servers.web.port, function () {

      var port = config.app.get('port');

      logger.start(port, config.environment);
      logger.success('open your browser to http://localhost:' + port);

      resolve(true);

    });

    config.server.on('error', function (e) {

      var port = config.app.get('port');

      if(e.errno === 'EADDRINUSE') {
        logger.error('Cannot start Ekko server on PORT ' + port + '. Check if port is already in use.');
      }

      reject(new Error(e));

    });

  });

};

proto.stop = function() {

  return new BPromise(function (resolve) {

    if(!config.server && !config.server.close) {
      resolve(true);
      return;
    }

    config.server.close(function () {
      resolve(true);
    });

  });

};
