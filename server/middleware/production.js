var express = require('express');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var routes = require('../routes');

var config = require('../config');

module.exports = function production() {

  config.app.use(logger('short'));
  config.app.use(compression());
  config.app.use(methodOverride('X-HTTP-Method-Override'));
  config.app.use(cors());

  config.app.use(bodyParser.json()); // parse application/json
  config.app.use(bodyParser.urlencoded({  // parse application/x-www-form-urlencoded
    extended: true,
    limit: config.options.limit
  }));
  config.app.use(busboy({ immediate: true }));

  config.app.use('/', config.router);
  config.app.use('/api', config.router);
  routes.init();

  var options = { maxAge: config.options.cache, }; // one day
  config.app.use(express.static(config.options.directory, options));

};

