/* globals describe, it*/
'use strict';

const request = require('superagent');
const chai = require('chai');
const _ = require('lodash');
const helper = require('../../tests/helpers');
const expect = chai.expect;

describe('Headers', () => {

  helper.serverSpecHelper();

  it('should respond with custom headers', (done) => {

    request.get(helper.getUrl('/v1/route7'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        expect(res.header.ping).to.equal('pong');
        done();
      });
  });

  it('route 2 should respond with dummy-response2.json for POST with X-HTTP-Method-Override:GET', (done) => {

    request.post(helper.getUrl('/internal/v2/route2'))
      .set('X-HTTP-Method-Override', 'GET')
      .send({bar: 'baz'})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });
});
