/*globals describe, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var expect = chai.expect;

describe('Routes', function () {

  helper.serverSpecHelper();

  it('route 1 should be defined with GET, PUT, POST and DELETE', function() {

    // since no verbs were defined the the mock server
    // will configure all verbs for this route
    var verbs = ['get', 'put', 'post', 'delete'];

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

    var _verbs = getConfiguredVerbs(helper.ekko, verbs, '/v1/route1.:format?');

    var count = _.intersection(verbs, _verbs).length;
    expect(count).to.equal(4);
  });

  it('route 1 should respond with dummy-response1.json', function (done) {
    request.get(helper.getUrl('/v1/route1'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('route 2 should respond with dummy-response2.json for GET', function (done) {

    request.get(helper.getUrl('/internal/v2/route2'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('route 2 should respond with dummy-response3.json for POST', function (done) {

    request.post(helper.getUrl('/internal/v2/route2'))
      .send({bar: 'baz'})
      .end(function(err,res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'c': 3})).to.be.ok;
        done();
      });
  });

  it('route 4 should respond with dummy-response-2.json for POST with parameters', function (done) {
    request.post(helper.getUrl('/v1/route4'))
      .send({a:{ b: 'b'}})
      .end(function(err,res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('route 4 should response with dummy-response1.json [default file] for POST with no parameters', function (done) {

    request.post(helper.getUrl('/v1/route4'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

});
