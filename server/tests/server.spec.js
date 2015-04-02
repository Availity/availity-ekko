/*globals describe, before, after, it*/
var request = require('request');
var chai = require('chai');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var BPromise = require('bluebird');

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

describe('Ekko', function () {

  var ekko;

  before(function(done) {
    ekko = new Ekko();
    ekko.start().then(function() {
      done();
    });
  });

  after(function(done) {
    ekko.stop().then(function() {
      done();
    });
  });

  it('should be defined', function() {
    expect(ekko).to.be.defined;
  });

  describe('routes:', function() {

    it('route 1 should be defined with GET, PUT, POST and DELETE', function () {

      // since no verbs were defined the the mock server
      // will configure all verbs for this route
      var verbs = ['get', 'put', 'post', 'delete'];

      var _verbs = getConfiguredVerbs(ekko, verbs, '/v1/route1.:format?');

      var count = _.intersection(verbs, _verbs).length;
      expect(count).to.equal(4);

    });

    it('route 1 should respond with dummy-response1.json', function (done) {
      request(getUrl('/v1/route1'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'a': 1});
        expect(isEqual).to.ok;
        done();
      });
    });

    it('route 2 should respond with dummy-response2.json for GET', function (done) {

      request(getUrl('/internal/v2/route2'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('route 2 should respond with dummy-response3.json for POST', function (done) {

      var options = {
        url: getUrl('/internal/v2/route2'),
        json: {
          bar: 'baz'
        }
      };

      request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(body, {'c': 3});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('route 4 should respond with dummy-response-2.json for POST with parameters', function (done) {

      var options = {
        url: getUrl('/v1/route4'),
        json: {
          a: {
            b: 'b'
          }
        }
      };

      request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(body, {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('route 4 should response with dummy-response1.json [default file] for POST with no parameters', function(done) {

      var options = {
        url: getUrl('/v1/route4')
      };

      request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'a': 1});
        expect(isEqual).to.be.ok;
        done();
      });
    });

  });

  describe('scoring query params:', function() {

    it('route 3 should respond with dummy-response2.json for GET with specified parameters', function(done) {
      request(getUrl('/v1/route3?param1=1&param2=2'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('route 3 should respond with dummy-response3.json for GET with specified parameters', function(done) {
      request(getUrl('/v1/route3?param1=1&param2=2&param3=3'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'c': 3});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('route 3 should respond with dummy-response2.json for GET with partial parameters', function(done) {
      request(getUrl('/v1/route3?param1=1'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('route 3 should respond with dummy-response4.json for GET with no matching parameters', function(done) {
      request(getUrl('/v1/route3?param1=452'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'d': 4});
        expect(isEqual).to.be.ok;
        done();
      });
    });

    it('should respond with base file for undefined query route', function (done) {
      request(getUrl('/internal/v2/route2?dummy=true'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });
    });

  });

  describe('scoring array params:', function() {

    it('should respond with dummy-response-2.json for GET with 3 matching params (1 non-array, 2 array)', function(done) {

      request(getUrl('/v1/route4?param1=a&param2=c&param2=d'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });

    });

    it('should respond with dummy-response-3.json for GET with 4 matching params (2 array, 2 array)', function(done) {

      request(getUrl('/v1/route4?param1=a&param1=b&param2=c&param2=d'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'c': 3});
        expect(isEqual).to.be.ok;
        done();
      });

    });

    it('should respond with dummy-response-4.json for GET with 2 matching params (2 array)', function(done) {

      request(getUrl('/v1/route4?param2=c&param2=d'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);

        var isEqual = _.isEqual(JSON.parse(body), {'d': 4});
        expect(isEqual).to.be.ok;
        done();
      });

    });

    it('should respond dummy-response-4.json when GET request has query params but the configuration for queries is undefined', function (done) {
      request(getUrl('/no/params?param1=a&param2=b'), function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);

        var isEqual = _.isEqual(JSON.parse(body), {'d': 4});
        expect(isEqual).to.be.ok;
        done();
      });
    });

  });

  describe('multi-part forms', function() {

    var options = {
      url: getUrl('/v1/route5')
    };

    it('should respond with dummy-response-1.json for empty form fields and one file attachment', function (done) {

      var r = request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'a': 1});
        expect(isEqual).to.be.ok;
        done();
      });

      var form = r.form();
      form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-1.json')));
    });

    it('should respond with dummy-response-2.json for empty form fields and one file attachment', function (done) {

      var r = request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });

      var form = r.form();
      form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-2.json')));
    });

    it('should respond with dummy-response-2.json for 1 matching form field and one file attachment', function (done) {

      var r = request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
        expect(isEqual).to.be.ok;
        done();
      });

      var form = r.form();
      form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-2.json')));
      form.append('a', '1');
    });

    it('should respond with dummy-response-3.json for 2 matching form fields and one file attachment', function (done) {

      var r = request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'c': 3});
        expect(isEqual).to.be.ok;
        done();
      });

      var form = r.form();
      form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-3.json')));
      form.append('a', 1);
      form.append('b', 2);
    });

    it('should respond with dummy-response-4.json for field name that matches file input name', function (done) {

      var r = request.post(options, function (error, response, body) {
        expect(error).to.be.null;
        expect(response.statusCode).to.equal(200);
        var isEqual = _.isEqual(JSON.parse(body), {'d': 4});
        expect(isEqual).to.be.ok;
        done();
      });

      var form = r.form();
      form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-4.json')));
    });

  });

  describe('asynchronous:', function() {

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
  });

  describe('behavior:', function() {

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

});
