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
  _.each(config.options.servers, function(server) {

    // if proxy flag is not true just continue
    if (!server.proxy) {
      return;
    }

    // ... get the proxy configuration and push into cache
    _.each(server.proxies, function(proxy) {
      var proxyConfig = {
        port: server.port,
        host: server.host || 'localhost',
        headers: _.merge({}, config.headers, server.headers, proxy.headers),
        context: proxy.context,
        rewrite: proxy.rewrite
      };
      logger.info('proxy created for context[%s] host[%s:%s] user[%s]', proxyConfig.context, proxyConfig.host, proxyConfig.port, proxyConfig.headers.RemoteUser);
      if (proxyConfig.rewrite) {
        logger.info('rewrite rule created for: [ %s ==> %s]', proxyConfig.rewrite.from, proxyConfig.rewrite.to);
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
        logger.error(e);
      });

    } else {
      next();
    }

  };

};
