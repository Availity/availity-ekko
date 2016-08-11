/* globals describe, it*/
'use strict';

const request = require('superagent');
const chai = require('chai');
const _ = require('lodash');
const helper = require('../../tests/helpers');
const expect = chai.expect;

describe('Routes', () => {

  helper.serverSpecHelper();

  it('route 1 should be defined with GET, PUT, POST and DELETE', () => {

    // since no verbs were defined the the mock server
    // will configure all verbs for this route
    const verbs = ['get', 'put', 'post', 'delete'];

    const getConfiguredVerbs = (ekko, expectedVerbs, path) => {

      const routeConfigs = ekko.config().router.stack;

      const _verbs = _.chain(routeConfigs)
        .map((routeConfig) => {
          if (routeConfig.route.path === path) {
            return _.keys(routeConfig.route.methods)[0];
          }
        })
        .filter((method) => {
          return method !== undefined;
        })
        .value();

      return _verbs;
    };

    const _verbs = getConfiguredVerbs(helper.ekko, verbs, '/v1/route1.:format?');

    const count = _.intersection(verbs, _verbs).length;
    expect(count).to.equal(4);
  });

  it('route 1 should respond with dummy-response1.json', (done) => {
    request.get(helper.getUrl('/v1/route1'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('route 2 should respond with dummy-response2.json for GET', (done) => {

    request.get(helper.getUrl('/internal/v2/route2'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('route 2 should respond with dummy-response3.json for POST', (done) => {

    request.post(helper.getUrl('/internal/v2/route2'))
      .send({bar: 'baz'})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'c': 3})).to.be.ok;
        done();
      });
  });

  it('route 4 should respond with dummy-response-2.json for POST with parameters', (done) => {
    request.post(helper.getUrl('/v1/route4'))
      .send({a: { b: 'b'}})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('route 4 should response with dummy-response1.json [default file] for POST with no parameters', (done) => {

    request.post(helper.getUrl('/v1/route4'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('route 9 should response with dummy-response1.json and status 201 for GET', (done) => {

    request.get(helper.getUrl('/v1/route9'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(201);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('route 9 should response with dummy-response2.json and status 422 for POST', (done) => {

    request.post(helper.getUrl('/v1/route9'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(203);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('external mock 1 should response with dummy-response1.json due to override defined', (done) => {

    request.post(helper.getUrl('/v1/external/route1'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('external mock 2 should response with external-dummy-response-1.json', (done) => {

    request.post(helper.getUrl('/v1/external/route2'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'z': 26})).to.be.ok;
        done();
      });
  });

});
