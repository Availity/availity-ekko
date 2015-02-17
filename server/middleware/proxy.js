var _ = require('lodash');
var httpProxy = require('http-proxy');
var routingProxy = httpProxy.createProxy();

var logger = require('../logger');
var config = require('../config');

var cache = null;

var buildProxyCache = function() {

  // once the cache is hydrated with configs just return it
  if(cache) {
    return;
  }

  cache = [];

  // for each server configuration...
  _.each(config.options.servers, function(server) {

    // if proxy flag is not true just continue
    if(!server.proxy) {
      return;
    }

    // ... get the proxy configuration and push into cache
    _.each(server.proxies, function(proxy) {

      var host = server.host || 'localhost';

      logger.warn('proxy created for context[' +  proxy.context + '] host[' + host + ':' + server.port + ']');
      if(proxy.rewrite) {
        logger.warn('rewrite rule created for: [' + proxy.rewrite.from + ' ==> ' + proxy.rewrite.to + '].');
      }

      cache.push({
        port: server.port,
        host: server.host || 'localhost',
        context: proxy.context,
        rewrite: proxy.rewrite
      });

    });

  });

};

// Rewrite the url and add the appropriate header if applicable
var buildRequest = function(req, proxyConfig) {

  if(proxyConfig.rewrite) {

    req.url = req.url.replace(new RegExp(proxyConfig.rewrite.from), proxyConfig.rewrite.to);
  }
  if(config.user) {
    req.headers['RemoteUser'] = config.user;
  }

};

module.exports = function proxy() {

  buildProxyCache();

  return function(req, res, next) {

    var proxyConfig = _.find(cache, function(config) {
      return req.url.match(new RegExp('^\\' + config.context + '\/.*'));
    });

    if(proxyConfig) {

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

    }else {
      next();
    }

  };

};
