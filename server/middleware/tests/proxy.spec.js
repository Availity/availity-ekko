/*globals describe, before, after, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var config = require('../../../config');
var expect = chai.expect;

describe('Proxy', function () {

  process.env.NODE_ENV = 'testing';

  helper.serverSpecHelper();

  var proxy1;
  var server1;
  var proxy2;
  var server2;

  before(function (done) {

    config.testing.servers.api.proxy = true;
    config.testing.servers.other.proxy = true;

    var express = require('express');

    var finished = _.after(2, function() {
      done();
    });

    proxy1 = express();

    proxy1.get('/v1/route1', function (req, res) {
      res.json({z: 36});
    });

    proxy2 = express();

    proxy2.get('/v2/route2', function(req, res) {
      res.json({y: 35});
    });

    server1 = proxy1.listen(config.testing.servers.api.port, finished);
    server2 = proxy2.listen(config.testing.servers.other.port, finished);

  });

  after(function(done) {

    config.testing.servers.api.proxy = false;
    config.testing.servers.other.proxy = false;

    var finished = _.after(2, function() {
      done();
    });

    if(server1 && server1.close) {
      server1.close(finished);
    }else {
      finished();
    }

    if(server2 && server2.close) {
      server2.close(finished);
    }else {
      finished();
    }

  });

  it('should get a response from /api/v1/route1', function(done) {

    request.get(helper.getUrl('/api/v1/route1'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body,{'z': 36})).to.be.ok;
        done();
      });
  });

  it('should rewrite /ui/route1 and proxy to /v1/route1', function(done) {
    request.get(helper.getUrl('/ui/route1'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body,{'z': 36})).to.be.ok;
        done();
      });
  });

  it('should get a response from /test/v2/route2', function(done) {
    request.get(helper.getUrl('/test/v2/route2'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body,{'y': 35})).to.be.ok;
        done();
      });
  });

});
