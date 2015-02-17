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

      res.status(status).sendFile(filePath, function(err) {
        if(err) {
          logger.fileNotFound(filePath);
          res.sendStatus(404);
        } else {
          logger.fileFound(filePath, status);
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
    //  'route1_request2': 0
    // }
    var cacheKey = routeId + '_' + requestId;

    var index = result.cache[cacheKey];
    if(index === undefined || index === null) {
      // nothing cached so set the index to 0 to return the first response configuration
      index = result.cache[cacheKey] = 0;
    }else {
      // increment the response index in a circular fashion
      index = (index + 1) % request.responses.length;

    }
    // cache the latest index
    result.cache[cacheKey] = index;
    // return the appropriate response object
    var response = request.responses[index];

    if(response.file) {
      this.file(res, response);
      return;
    }

    this.url(res, response);

  }

};

module.exports = result;
