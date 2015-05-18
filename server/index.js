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
  config.router = express.Router();

  middleware.headers();

  var environment = process.env.NODE_ENV;
  middleware[environment || 'development']();

  var port = config.options.servers.web.port || 0;
  config.app.set('port', port);
  config.server = http.createServer(config.app);

//  config.server.address().port ?
  return new BPromise(function (resolve, reject) {

    config.server.listen(config.options.servers.web.port, function () {

      config.addressInUse = config.server.address();

      var port = config.addressInUse.port;
      //var port = config.app.get('port');

      logger.start(port, config.environment);
      logger.success('open your browser to http://localhost:' + port);

      resolve(true);

    });

    config.server.on('error', function (e) {

      var port = config.addressInUse.port;

      if(e.errno === 'EADDRINUSE') {
        logger.error('Cannot start Ekko server on PORT ' + port + '. Check if port is already in use.');
      }

      reject(new Error(e));

    });

  });

};

proto.stop = function() {

  return new BPromise(function (resolve) {

    var shouldClose = config.server && config.server.close;

    if(!shouldClose){
      resolve(true);
      return;
    }

    config.server.close(function () {
      resolve(true);
    });

  });

};

proto.config = function() {
  return config;
};
