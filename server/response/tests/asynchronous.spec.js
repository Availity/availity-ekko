/*globals describe, it*/

var request = require('superagent-bluebird-promise');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var expect = chai.expect;

describe('Asynchronous', function () {

  process.env.NODE_ENV = 'testing';

  helper.serverSpecHelper();

  it('should respond with 202 then 201', function (done) {
    request.get(helper.getUrl('/v1/route6'))
      .then(function(res) {
        expect(res.status).to.be.equal(202);
        expect(_.isEqual(res.body,{'c': 3})).to.be.ok;

        return request.get(helper.getUrl('/v1/route6'));
      })
      .then(function(res) {
        expect(res.status).to.be.equal(201);
        expect(_.isEqual(res.body, {'d': 4})).to.be.ok;
        done();
      });
  });
});
