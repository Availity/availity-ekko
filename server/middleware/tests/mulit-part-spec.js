/* globals describe, it*/
'use strict';

const request = require('superagent');
const chai = require('chai');
const _ = require('lodash');
const helper = require('../../tests/helpers');
const expect = chai.expect;

describe('Multi-part', () => {

  helper.serverSpecHelper();

  it('should respond with dummy-response-1.json for empty form fields and one file attachment', (done) => {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attatchment', helper.getFile('dummy-response-1.json'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'a': 1})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-2.json for empty form fields and one file attachment', (done) => {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-2.json'))
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-2.json for 1 matching form field and one file attachment', (done) => {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-2.json'))
      .field('a', '1')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(_.isEqual(res.body, {'b': 2})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-3.json for 2 matching form fields and one file attachment', (done) => {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-3.json'))
      .field('a', '1')
      .field('b', '2')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(_.isEqual(res.body, {'c': 3})).to.be.ok;
        done();
      });
  });

  it('should respond with dummy-response-4.json for field name that matches file input name', (done) => {
    request.post(helper.getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attachment', helper.getFile('dummy-response-4.json'))
      .field('a', '1')
      .field('b', '2')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(_.isEqual(res.body, {'d': 4})).to.be.ok;
        done();
      });
  });
});
