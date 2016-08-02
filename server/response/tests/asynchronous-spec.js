/* globals describe, it*/
'use strict';

const request = require('superagent-bluebird-promise');
const chai = require('chai');
const _ = require('lodash');
const helper = require('../../tests/helpers');
const expect = chai.expect;

describe('Asynchronous', () => {

  helper.serverSpecHelper();

  it('should respond with 202 then 201', (done) => {
    request.get(helper.getUrl('/v1/route6'))
      .then((res) => {
        expect(res.status).to.be.equal(202);
        expect(_.isEqual(res.body, {'c': 3})).to.be.ok;
        return request.get(helper.getUrl('/v1/route6'));
      })
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(_.isEqual(res.body, {'d': 4})).to.be.ok;
        done();
      });
  });

  it('should repeat dummy-response1.json x3, dummy-response2.json x1 then followed by a dummy-response2 x1', (done) => {
    request.get(helper.getUrl('/v1/route8'))
      .then((res) => {
        expect(res.status).to.equal(202);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        return request.get(helper.getUrl('/v1/route8'));
      }).then((res) => {
        expect(res.status).to.equal(202);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        return request.get(helper.getUrl('/v1/route8'));
      }).then((res) => {
        expect(res.status).to.equal(202);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        return request.get(helper.getUrl('/v1/route8'));
      }).then((res) => {
        expect(res.status).to.equal(202);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        return request.get(helper.getUrl('/v1/route8'));
      }).then((res) => {
        expect(res.status).to.equal(201);
        expect(_.isEqual(res.body, {'c': 3})).to.be.ok;
        done();
      });
  });
});
