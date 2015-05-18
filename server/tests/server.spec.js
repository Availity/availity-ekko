/*globals describe, before, after, it*/
var request = require('request');
var chai = require('chai');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var BPromise = require('bluebird');

var helper = require('./helpers');

var expect = chai.expect;

process.env.NODE_ENV = 'testing';

var config = require('../../config');
var Ekko = require('../index');

var getUrl = function (endpoint) {
  var url =  ['http://', config.testing.servers.web.host, ':', config.testing.servers.web.port, endpoint].join('');
  return url;
};

var getConfiguredVerbs = function(ekko, expectedVerbs, path) {

  var routeConfigs = ekko.config().router.stack;

  var verbs = _.chain(routeConfigs)
  .map(function(routeConfig) {
    if(routeConfig.route.path === path) {
      return _.keys(routeConfig.route.methods)[0];
    }
  })
  .filter(function(method) {
    return method !== undefined;
  })
  .value();

  return verbs;

};

describe('Ekko |', function () {

  //var ekko;

  helper.serverSpecHelper();

  it('should be defined', function () {
    expect(helper.ekko).to.be.defined;
  });
});
