var expressLogger = require('morgan');
var errorhandler = require('errorhandler');
var compression = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var tFunk = require('tfunk');

var config = require('../config');
var proxy = require('./proxy');
var logger = require('../logger');
var negotiate = require('./negotiation');
var routes = require('../routes');
var dateformat = require('dateformat');

var avPrefixFunk = tFunk('[{grey:%s}]} {yellow:[av-ekko]}');
var avMethodFunk = tFunk('{bold:%s');

expressLogger.token('prefix', function() {
  return avPrefixFunk.replace('%s', dateformat(new Date(), 'HH:MM:ss'));
});

expressLogger.token('avMethod', function getMethodToken(req) {
  return avMethodFunk.replace('%s', req.method);
});

expressLogger.token('avStatus', function getStatusToken(req, res) {
  var code = res._header
    ? String(res.statusCode)
    : '';

  return avMethodFunk.replace('%s', code);
});

module.exports = function development() {

  config.app.use(expressLogger(':prefix :avMethod :url :avStatus :response-time'));
  config.app.use(errorhandler());
  config.app.use(compression());
  config.app.use(cors());
  config.app.use(negotiate());

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
    limit: config.options.limit
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

};
