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
  init() {

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

    config.options.endpoints = {};

    // Load plugins that contain data and routes
    this.plugins();

    // Load local data and routes.  Local data and routes should override the plugins.
    const routePaths = config.options.routes;
    const dataPath = config.options.data;
    this.routes(routePaths, dataPath);

    _.each(config.options.endpoints, (endpoint, url) => {
      const route = new Route(url, endpoint, endpoint.dataPath);
      self.add(route);
    });
  },

  routes(routePaths, dataPath) {
    // support multiple directories for routes
    routePaths = _.isArray(routePaths) ? routePaths : [routePaths];

    _.forEach(routePaths, routePath => {
      const routeConfig = JSON.parse(fs.readFileSync(routePath, 'utf8'));
      _.each(routeConfig, (route) => {
        route.dataPath = dataPath;
      });
      _.merge(config.options.endpoints, routeConfig);
    });
  },

  plugins() {

    const plugins = config.options.plugins || [];

    _.forEach(plugins, plugin => {

      let pluginConfig = null;

      try {
        pluginConfig = require(plugin);
      } catch (err) {
        // workaround when `npm link`'ed for development
        const parentRequire = require('parent-require');
        pluginConfig = parentRequire(plugin);
      }

      this.routes(pluginConfig.routes, pluginConfig.data);
    });

  },

  /**
   * Create a route in Express and cache the route in the config object cache.  Express routes
   * forward request to the response module.  The route configuration is attached to the res.locals
   * object for later use.
   *
   * @param {Object} route Object representation route in the configuration file.
   */
  add(route) {

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
