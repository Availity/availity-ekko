/* globals describe, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var expect = chai.expect;

describe('Headers', function() {

  helper.serverSpecHelper();

  it('should respond with custom headers', function(done) {

    request.get(helper.getUrl('/v1/route7'))
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        expect(res.header.ping).to.equal('pong');
        done();
      });
  });

  it('route 2 should respond with dummy-response2.json for POST with X-HTTP-Method-Override:GET', function(done) {

    request.post(helper.getUrl('/internal/v2/route2'))
      .set('X-HTTP-Method-Override', 'GET')
      .send({bar: 'baz'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });
});
