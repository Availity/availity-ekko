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


  /*
   describe('asynchronous |', function() {

   it('should respond with 202 then 201', function (done) {

   var bRequest = BPromise.promisify(require('request'));

   bRequest(getUrl('/v1/route6')).spread(function(response, body) {

   expect(response.statusCode).to.equal(202);
   var isEqual = _.isEqual(JSON.parse(body), {'c': 3});
   expect(isEqual).to.be.ok;

   }).then(function() {

   bRequest(getUrl('/v1/route6')).spread(function(response, body) {
   expect(response.statusCode).to.equal(201);
   var isEqual = _.isEqual(JSON.parse(body), {'d': 4});
   expect(isEqual).to.be.ok;
   done();
   });
   });

   });
   });*/

  /*describe('headers |', function () {

    it('should respond with custom headers', function (done) {

      var bRequest = BPromise.promisify(require('request'));

      bRequest(getUrl('/v1/route7')).spread(function (response, body) {

        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;

        // test for headers
        expect(response.headers.ping).to.equal('pong');

        done();
      });

    });
  });

  describe('behavior |', function () {

    it('should respond with 404 for undefined route', function (done) {
      request(getUrl('/dummy/route'), function (error, response) {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });

    it('should respond with 404 when file does not exist', function (done) {
      request(getUrl('/bad/file'), function (error, response) {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });

  });

  describe('proxy |', function () {

    var proxy;

    before(function (done) {

      config.testing.servers.api.proxy = true;

      var express = require('express');
      proxy = express();
      var router = express.Router();
      router.all('v1/route1', function (req, res) {
        res.json({z: '36'});
      });

      proxy.use('/api', router);

      proxy.listen(config.testing.servers.api.port, function () {
        done();
      });

    });

    after(function (done) {
      config.testing.servers.api.proxy = false;
      proxy.close(function () {
        done();
      });
    });

    /*it('should get a response from /api/v1/route1', function(done) {

     request(getUrl('/api/v1/route1'), function (error, response, body) {
     expect(error).to.be.null;
     expect(response.statusCode).to.equal(200);
     var isEqual = _.isEqual(JSON.parse(body), {'z': 36});
     expect(isEqual).to.ok;
     done();
     });

     });
     });

  });*/

});
