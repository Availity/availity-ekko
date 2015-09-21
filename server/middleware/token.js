var logger = require('../logger');

/**
 * `server.options.token` is flag used to put in hook to API authentication timeout
 *
 * To flip on/off sessionValid use following on browser: http://localhost:8280/v1/toggle/token
 */

module.exports = function token(options) {

  return function(req, res, next) {

    if (req.path === '/toggle/token') {
      options.token = !options.token;

      var message = 'Mock server token flag is ' + (options.token ? 'on' : 'off');
      res.json(200, { 'message': message});

      logger.info(message);
      return;
    }

    if (!options.token || req.path === '/availity/JwsServlet') {
      // if
      next();
      return;
    }

    var authorization = req.get('Authorization');
    authorization =  authorization || '';

    if (!authorization && !authorization.match('JWS [a-zA-Z0-9-_=.]+')) {
      res.send(419, { error: 'Mock server require authorization token' });
      return;
    }

    next();

  };
};
