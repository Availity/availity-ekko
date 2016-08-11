'use strict';

const _ = require('lodash');
const fs = require('fs');

const config = require('../config');
const response = require('../response');
const models = require('../models');
const Route = models.Route;

const _routes = {

  /**
   * Initialize the Express routes from the endpoints in the configurations file.
   */
  init: function() {

    var self = this;

    const router = config.router;

    // Add default route.  Configurations should be allowed to override this if needed.
    router.get('/', (req, res) => {

      const pkg = require('../../package.json');
      res.send({
        name: pkg.name,
        description: pkg.description,
        version: pkg.version
      });
    });

    config.options.endpoints = {};

    // Process external routes
    const externalMocks = _.get(config, 'options.externalMocks');
    if (_.isArray(externalMocks)) {
      _.forEach(externalMocks, (externalMock) => {
        self.processRoutes(externalMock.routes, externalMock.data);
      });
    }

    // Process internal routes
    const routePaths = config.options.routes;
    const dataPath = config.options.data;
    this.processRoutes(routePaths, dataPath);

    _.each(config.options.endpoints, (endpoint, url) => {
      const route = new Route(url, endpoint, endpoint.dataPath);
      self.add(route);
    });
  },

  processRoutes: function(routePaths, dataPath) {
    // convert to array
    routePaths = _.isArray(routePaths) ? routePaths : [routePaths];

    _.forEach(routePaths, (routePath) => {
      const routeConfig = JSON.parse(fs.readFileSync(routePath, 'utf8'));
      _.each(routeConfig, (route) => {
        route.dataPath = dataPath;
      });
      _.merge(config.options.endpoints, routeConfig);
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

    const methods = _.keys(route.methods);
    const router = config.router;

    _.each(methods, (method) => {
      // builds get|post|put|delete routes like /v1/payers
      router[method](route.url, (req, res, next) => {
        // get from cache and attach to request local
        res.locals.route = config.routes[route.id];
        response.send(req, res, next);
      });
    });
  }
};

module.exports = _routes;
