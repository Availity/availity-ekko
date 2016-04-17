var _ = require('lodash');
var fs = require('fs');

var config = require('../config');
var response = require('../response');
var models = require('../models');
var Route = models.Route;

var _routes = {

  /**
   * Initialize the Express routes from the endpoints in the configurations file.
   */
  init: function() {

    var self = this;

    var router = config.router;

    // Add default route.  Configurations should be allowed to override this if needed.
    router.get('/', function(req, res) {

      var pkg = require('../../package.json');
      res.send({
        name: pkg.name,
        description: pkg.description,
        version: pkg.version
      });
    });

    var routePaths = config.options.routes;
    // convert to array
    routePaths = _.isArray(routePaths) ? routePaths : [routePaths];

    config.options.endpoints = {};
    _.forEach(routePaths, function(path) {
      var routeConfig = JSON.parse(fs.readFileSync(path, 'utf8'));
      _.merge(config.options.endpoints, routeConfig);
    });

    _.each(config.options.endpoints, function(endpoint, url) {
      var route = new Route(url, endpoint);
      self.add(route);
    });
  },

  /**
   * Create a route in Express and cache the route in the config object cache.  Express routes
   * forward request to the response module.  The route configuration is attached to the res.locals
   * object for later use.
   *
   * @param {Object} route Object representation route in the configuration file.
   */
  add: function(route) {

    // cache the route configuration
    config.routes[route.id] = route;

    var methods = _.keys(route.methods);
    var router = config.router;

    _.each(methods, function(method) {
      // builds get|post|put|delete routes like /v1/payers
      router[method](route.url, function(req, res, next) {
        // get from cache and attach to request local
        res.locals.route = config.routes[route.id];
        response.send(req, res, next);
      });
    });
  }
};

module.exports = _routes;
