'use strict';

const expressLogger = require('morgan');
const errorhandler = require('errorhandler');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const tFunk = require('tfunk');
const _ = require('lodash');

const config = require('../config');
const proxy = require('./proxy');
const logger = require('../logger');
const routes = require('../routes');
const dateformat = require('dateformat');
const requestHandler = require('./request');
const notFoundHandler = require('./not.found');

const avPrefixFunk = tFunk('[{grey:%s}]} {yellow:[av-ekko]}');
const avMethodFunk = tFunk('{bold:%s');

expressLogger.token('prefix', () => {
  return avPrefixFunk.replace('%s', dateformat(new Date(), 'HH:MM:ss'));
});

expressLogger.token('avMethod', function getMethodToken(req) {
  return avMethodFunk.replace('%s', req.method);
});

expressLogger.token('avStatus', function getStatusToken(req, res) {
  const code = res._header
    ? String(res.statusCode)
    : '';

  return avMethodFunk.replace('%s', code);
});

module.exports = function development() {

  config.app.use(expressLogger(':prefix :avMethod :url :avStatus :response-time'));
  config.app.use(requestHandler());
  config.app.use(errorhandler());
  config.app.use(compression());
  config.app.use(cors());

  // pretty print json
  config.app.set('json spaces', 2);

  // Proxies must be configured before the mock routes so they can be intercepted
  // and forwarded to appropriate server
  if (config.isProxyEnabled()) {
    logger.info('Proxy configurations detected');
    config.app.use(proxy());
  } else {
    logger.info('No proxy configurations detected');
  }

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
  config.app.use('/public/api', config.router);
  routes.init();

  config.app.use(notFoundHandler());

};
