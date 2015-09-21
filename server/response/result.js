var path = require('path');
var BPromise = require('bluebird');

var config = require('../config');
var logger = require('../logger');

var result =  {

  cache: {},

  file: function(res, response) {
    BPromise.delay(response.latency || 200).then(function() {

      var filePath = path.join(config.options.data, response.file);
      var status = response.status || 200;

      if (response.headers) {
        res.set(response.headers);
      }

      res.status(status).sendFile(filePath, function(err) {
        if (err) {
          logger.error('{red:FILE {cyan:%s} {bold:NOT FOUND}', filePath);
          res.sendStatus(404);
        } else {
          logger.info('{green:FILE {cyan:%s} {gray:%s}', filePath, status);
        }
      });
    });
  },

  url: function(res, response) {
    res.redirect(response.url);
  },

  send: function(req, res) {
    var route = res.locals.route;
    var request = res.locals.request;

    var routeId = route.id;
    var requestId = request.id;

    // cache: {
    //  'route1_request2': [0,0] //  position 0 === response index; position 1 === repeat index
    // }
    var cacheKey = routeId + '_' + requestId;

    var indexes = result.cache[cacheKey];

    if (!indexes) { // empty cache so hydrate
      indexes = result.cache[cacheKey] = [0, 0];
    }

    var responseIndex = indexes[0];
    var repeatIndex = indexes[1];

    var response = request.responses[responseIndex];

    if (repeatIndex >= response.repeat) {
      responseIndex = (responseIndex + 1) % request.responses.length;
      repeatIndex = 0;
    }

    repeatIndex++;

    // cache the latest index for the next request
    indexes[0] = responseIndex;
    indexes[1] = repeatIndex;
    result.cache[cacheKey] = indexes;

    // return the appropriate response object
    response = request.responses[responseIndex];

    if (response.file) {
      this.file(res, response);
      return;
    }

    this.url(res, response);

  }
};

module.exports = result;
