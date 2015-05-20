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
      var proxyConfig = {
        port: server.port,
        host: server.host || 'localhost',
        user: proxy.user || config.options.user,
        context: proxy.context,
        rewrite: proxy.rewrite
      };
      logger.warn('proxy created for context[' + proxyConfig.context + '] host[' + proxyConfig.host + ':' + proxyConfig.port + ']' + '] user[' + proxyConfig.user + ']');
      if(proxyConfig.rewrite) {
        logger.warn('rewrite rule created for: [' + proxyConfig.rewrite.from + ' ==> ' + proxyConfig.rewrite.to + '].');
      }
      cache.push(proxyConfig);
    });

  });

};

// Rewrite the url and add the appropriate header if applicable
var buildRequest = function(req, proxyConfig) {
  if(proxyConfig.rewrite) {
    req.url = req.url.replace(new RegExp(proxyConfig.rewrite.from), proxyConfig.rewrite.to);
  }

  if(proxyConfig.user) {
    req.headers['RemoteUser'] = proxyConfig.user;
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

    } else {
      next();
    }

  };

};
