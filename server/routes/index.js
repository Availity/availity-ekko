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

    const self = this;

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

    let routePaths = config.options.routes;
    // convert to array
    routePaths = _.isArray(routePaths) ? routePaths : [routePaths];

    config.options.endpoints = {};
    _.forEach(routePaths, (path) => {
      const routeConfig = JSON.parse(fs.readFileSync(path, 'utf8'));
      _.merge(config.options.endpoints, routeConfig);
    });

    _.each(config.options.endpoints, (endpoint, url) => {
      const route = new Route(url, endpoint);
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
