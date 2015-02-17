var config = require('../config');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

module.exports = function production() {

  config.app.use(logger('short'));
  config.app.use(compression());
  config.app.use(methodOverride('X-HTTP-Method-Override'));
  config.app.use(cors());

  config.app.use(bodyParser.json()); // parse application/json
  config.app.use(bodyParser.urlencoded({  // parse application/x-www-form-urlencoded
    extended: true,
    limit: '20mb'
  }));
  config.app.use(busboy({ immediate: true }));

  config.app.use('/', config.router);

};

