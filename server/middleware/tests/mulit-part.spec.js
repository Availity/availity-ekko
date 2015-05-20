/*globals describe, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var expect = chai.expect;

describe.skip('Multi-part', function () {

  helper.serverSpecHelper();

  it('should respond with dummy-response-1.json for empty form fields and one file attachment', function (done) {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attatchment', helper.getFile('dummy-response-1.json'))
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-2.json for empty form fields and one file attachment', function (done) {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-2.json'))
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b':2})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-2.json for 1 matching form field and one file attachment', function (done) {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-2.json'))
      .field('a', '1')
      .end(function(err,res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(_.isEqual(res.body, {'b':2})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-3.json for 2 matching form fields and one file attachment', function (done) {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-3.json'))
      .field('a', '1')
      .field('b','2')
      .end(function(err,res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(_.isEqual(res.body, {'c':3})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-4.json for field name that matches file input name', function (done) {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-4.json'))
      .field('a', '1')
      .field('b','2')
      .end(function(err,res) {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(_.isEqual(res.body, {'d':4})).to.be.ok;
        done();
      });
  });
});
