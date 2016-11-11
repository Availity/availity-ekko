'use strict';

const expressLogger = require('morgan');
const errorhandler = require('errorhandler');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const _ = require('lodash');
const chalk = require('chalk');

const config = require('../config');
const routes = require('../routes');
const Logger = require('../logger');
const dateformat = require('dateformat');
const requestHandler = require('./request');
const notFoundHandler = require('./not.found');

expressLogger.token('prefix', () => {
  const timestamp = `[${chalk.cyan(dateformat(new Date(), 'HH:MM:ss'))}]`;
  return timestamp;
});

expressLogger.token('avMethod', function getMethodToken(req) {
  const method = chalk.dim(req.method);
  return method;
});

expressLogger.token('avStatus', function getStatusToken(req, res) {
  const code = res._header
    ? String(res.statusCode)
    : '';

  return chalk.dim(code);
});

module.exports = function development() {

  if (Logger.canLog()) {
    config.app.use(expressLogger(':prefix :avMethod :url :avStatus :response-time'));
  }

  config.app.use(requestHandler());
  config.app.use(errorhandler());
  config.app.use(compression());
  config.app.use(cors());

  // pretty print json
  config.app.set('json spaces', 2);

  config.app.use(methodOverride('X-HTTP-Method-Override'));

  config.app.use(bodyParser.json({
    limit: _.get(config, 'options.limit', '50mb')
  })); // parse application/json

  config.app.use(bodyParser.urlencoded({
    extended: true,
    limit: config.options.limit
  })); // // parse application/x-www-form-urlencoded

  config.app.use(busboy({ immediate: false }));

  config.app.use('/', config.router);
  config.app.use('/api', config.router);
  routes.init();

  config.app.use(notFoundHandler());

};
