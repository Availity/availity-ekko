var _ = require('lodash');
var httpProxy = require('http-proxy');
var routingProxy = httpProxy.createProxy();

var logger = require('../logger');
var config = require('../config');

var cache = null;

var buildProxyCache = function() {

  // once the cache is hydrated with configs just return it
  if (cache) {
    return;
  }

  cache = [];

  if (config.options.user) {
    config.headers = {
      'RemoteUser': config.options.user
    };
  }

  // for each server configuration...
  _.forEach(config.options.servers, function(server) {

    // if proxy flag is not true just continue
    if (!server.proxy) {
      return;
    }

    // ... get the proxy configuration and push into cache
    _.forEach(server.proxies, function(proxy) {
      var proxyConfig = {
        port: server.port,
        host: server.host || 'localhost',
        headers: _.merge({}, config.headers, server.headers, proxy.headers),
        context: proxy.context,
        rewrite: proxy.rewrite
      };

      logger.info('Proxy created for host {yellow:%s:%s} and context path {yellow:%s} for user {yellow:%s}', proxyConfig.host, proxyConfig.port, proxyConfig.context, proxyConfig.headers.RemoteUser);

      if (proxyConfig.rewrite) {
        var to = proxyConfig.rewrite.to === '' ? '\'\'' : proxyConfig.rewrite.to;
        logger.info('Rewrite rule created for: {yellow:%s} {bold:==>} {yellow:%s}', proxyConfig.rewrite.from, to);
      }

      cache.push(proxyConfig);

    });

  });

};

// Rewrite the url and add the appropriate header if applicable
var buildRequest = function(req, proxyConfig) {
  if (proxyConfig.rewrite) {
    req.url = req.url.replace(new RegExp(proxyConfig.rewrite.from), proxyConfig.rewrite.to);
  }

  // _.merge recursively copies over values that are not undefined within the source object
  // _.defaults only assigns to those properties that are still undefined in the target
  if (proxyConfig.headers) {
    _.merge(req.headers, proxyConfig.headers);
  }

};

module.exports = function proxy() {

  buildProxyCache();

  return function(req, res, next) {

    var proxyConfig = _.find(cache, function(_config) {
      return req.url.match(new RegExp('^\\' + _config.context + '.*'));
    });

    if (proxyConfig) {

      buildRequest(req, proxyConfig);

      var options = {
        target: {
          host: proxyConfig.host,
          port: proxyConfig.port
        }
      };

      routingProxy.web(req, res, options, function(e) {
        logger.error('{red:%s', e);
      });

    } else {
      next();
    }

  };

};
