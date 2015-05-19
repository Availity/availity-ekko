/*globals describe, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var expect = chai.expect;
process.env.NODE_ENV = 'testing';

describe('Headers', function () {

  helper.serverSpecHelper();

  it('should respond with custom headers', function (done) {

    request.get(helper.getUrl('/v1/route7'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        expect(res.header.ping).to.equal('pong');
        done();
      });
  });
});
