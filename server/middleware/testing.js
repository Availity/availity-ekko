var expressLogger = require('morgan');
var errorhandler = require('errorhandler');
var compression = require('compression');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var config = require('../config');
var negotiate = require('./negotiation');
var routes = require('../routes');

module.exports = function production() {

  config.app.use(expressLogger('dev'));
  config.app.use(errorhandler());
  config.app.use(compression());
  config.app.use(methodOverride('X-HTTP-Method-Override'));
  config.app.use(negotiate());

  config.app.use(bodyParser.json()); // parse application/json
  config.app.use(bodyParser.urlencoded({
    extended: true,
    limit: '20mb'
  })); // // parse application/x-www-form-urlencoded
  config.app.use(busboy({ immediate: true }));

  config.app.use('/', config.router);
  routes.init();

};