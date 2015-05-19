'use strict';

var logger = require('../logger');

/**
 * `server.options.token` is flag used to force token authentication on API request.
 *
 * To flip on/off, use following on browser: http://localhost:8280/v1/toggle/token
 */

module.exports = function axiSession(options) {

  return function(req, res, next) {

    if (options.session) {
      res.redirect('/availity/login');
      return;
    }

    if (req.path === '/toggle/session') {
      options.session = !options.session;

      var message = 'Mock server session flag is ' + (options.session ? 'on' : 'off');

      res.json({ 'message': message});

      logger.info(message);
      return;
    }


    next();

  };
};
