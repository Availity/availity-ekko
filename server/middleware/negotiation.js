var url = require('url');

/**
 * Middleware that changes the accept header of the request to application/json if the URL ends with .json,
 * or to application/xml if the URL ends with .xml, etc.
 *
 */
module.exports = function negotiate() {

  return function(req, res, next) {

    if(url.parse(req.url).pathname.match(/\.json$/)) {
      req.headers.accept = 'application/json';
    }else if(url.parse(req.url).pathname.match(/\.xml$/)) {
      req.headers.accept = 'application/xml';
    }else if(url.parse(req.url).pathname.match(/\.txt$/)) {
      req.headers.accept = 'text/plain';
    }

    next();

  };
};
