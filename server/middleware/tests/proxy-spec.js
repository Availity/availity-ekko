/* globals describe, beforeEach, before, after, afterEach, it*/
'use strict';

const request = require('superagent');
const chai = require('chai');
const _ = require('lodash');
const helper = require('../../tests/helpers');
const config = require('../../tests/test-config');
const expect = chai.expect;

describe('Proxy', () => {

  helper.serverSpecHelper();

  let proxy1;
  let server1;
  let proxy2;
  let server2;

  before(() => {
    config.servers.api.proxy = true;
    config.servers.other.proxy = true;
  });

  after(() => {
    config.servers.api.proxy = false;
    config.servers.other.proxy = false;
  });

  beforeEach((done) => {
    const express = require('express');

    const finished = _.after(2, () => {
      done();
    });

    proxy1 = express();

    proxy1.get('/v1/route1', (req, res) => {
      res.json({
        z: 36
      });
    });

    proxy1.get('/v1/me', (req, res) => {
      res.json({
        me: req.headers.remoteuser
      });
    });

    proxy1.get('/services', (req, res) => {
      res.json({
        r: 15
      });
    });

    proxy2 = express();

    proxy2.get('/v2/route2', (req, res) => {
      res.json({
        y: 35
      });
    });

    proxy2.get('/v2/me', (req, res) => {
      const body = {
        'me': req.headers.remoteuser,
        'custom1': ''
      };
      if (req.headers.custom1) {
        body.custom1 = req.headers.custom1;
      }
      res.json(body);
    });

    server1 = proxy1.listen(config.servers.api.port, finished);
    server2 = proxy2.listen(config.servers.other.port, finished);

  });

  afterEach((done) => {

    const finished = _.after(2, () => {
      done();
    });

    if (server1 && server1.close) {
      server1.close(finished);
    } else {
      finished();
    }

    if (server2 && server2.close) {
      server2.close(finished);
    } else {
      finished();
    }

  });

  it('should get a response from /api/v1/route1', (done) => {

    request.get(helper.getUrl('/api/v1/route1'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(_.isEqual(res.body, {
        'z': 36
      })).to.be.ok;
      done();
    });
  });

  it('should rewrite /ui/route1 and proxy to /v1/route1', (done) => {
    request.get(helper.getUrl('/ui/route1'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(_.isEqual(res.body, {
        'z': 36
      })).to.be.ok;
      done();
    });
  });

  it('should get a response from /test1/v2/route2', (done) => {
    request.get(helper.getUrl('/test1/v2/route2'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(_.isEqual(res.body, {
        'y': 35
      })).to.be.ok;
      done();
    });
  });

  it('should get response from proxy with no trailing slash', (done) => {
    request.get(helper.getUrl('/services'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(_.isEqual(res.body, {
        'r': 15
      })).to.be.ok;
      done();
    });
  });

  it('should set custom header from global user option', (done) => {
    request.get(helper.getUrl('/api/v1/me'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(_.isEqual(res.body, {
        'me': 'testuser'
      })).to.be.ok;
      done();
    });
  });

  it('should set custom header from server options', (done) => {
    request.get(helper.getUrl('/test1/v2/me'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(_.isEqual(res.body, {
        'me': 'otheruser',
        'custom1': ''
      })).to.be.ok;
      done();
    });
  });

  it('should get a response from /public/api/v2/route2', (done) => {
    request.get(helper.getUrl('/public/api/v2/route2'))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      done();
    });
  });

});
