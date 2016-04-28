var config = require('../config');

function requestHandler() {
  return function(req, res, next) {
    config.events.emit(config.constants.EVENTS.REQUEST, {
      req: req
    });

    next();
  };
}

function notFoundHandler() {
  return function(err, req, res, next) {
    if (err.status === 404) {
      config.events.emit(config.constants.EVENTS.FILE_NOT_FOUND, {
        req: req
      });
    }

    next();
  };
}

module.exports = function events() {

  config.app.use([
    requestHandler(),
    notFoundHandler()
  ]);

};
