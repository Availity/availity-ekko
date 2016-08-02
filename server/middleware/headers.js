'use strict';

const config = require('../config');

module.exports = function headers() {

  config.app.disable('x-powered-by');
  config.app.use(function(req, res, next) {
    res.setHeader('X-Powered-By', 'Ekko');
    next();
  });

};
