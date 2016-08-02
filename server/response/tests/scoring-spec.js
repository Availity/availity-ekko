/* globals describe, it*/
'use strict';

const request = require('superagent');
const chai = require('chai');
const _ = require('lodash');
const helper = require('../../tests/helpers');
const expect = chai.expect;


describe('Scoring', () => {

  helper.serverSpecHelper();

  describe('Parameters', () => {

    it('route 3 should respond with dummy-response2.json for GET with partial parameters', (done) => {
      request.get(helper.getUrl('/v1/route3?param1=1'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response2.json for GET with specified parameters', (done) => {
      request.get(helper.getUrl('/v1/route3?param1=1&param2=2'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response3.json for GET with \'.\' in parameters', (done) => {
      request.get(helper.getUrl('/v1/route3?param1=1&param2=2&param3=3'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'c': 3
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response3.json for GET with specified parameters', (done) => {
      request.get(helper.getUrl('/v1/route3?param1.2=abc'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'c': 3
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response4.json for GET with no matching parameters', (done) => {
      request.get(helper.getUrl('/v1/route3?param1=452'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'd': 4
          })).to.be.ok;
          done();
        });
    });

    it('should respond with base file for undefined query route', (done) => {
      request.get(helper.getUrl('/internal/v2/route2?dummy=true'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });
  });

  describe('Array Parameters', () => {

    it('should respond with dummy-response-2.json for GET with 3 matching params (1 non-array, 2 array)', (done) => {
      request.get(helper.getUrl('/v1/route4?param1=a&param2=c&param2=d'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('should respond with dummy-response-3.json for GET with 4 matching params (2 array, 2 array)', (done) => {
      request.get(helper.getUrl('/v1/route4?param1=a&param1=b&param2=c&param2=d'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'c': 3
          })).to.be.ok;
          done();
        });
    });

    it('should respond with dummy-response-4.json for GET with 2 matching params (2 array)', (done) => {
      request.get(helper.getUrl('/v1/route4?param2=c&param2=d'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'd': 4
          })).to.be.ok;
          done();
        });
    });

    it('should respond dummy-response-4.json when GET request has query params but the configuration for queries is undefined', (done) => {
      request.get(helper.getUrl('/no/params?param1=a&param2=b'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'd': 4
          })).to.be.ok;
          done();
        });
    });
  });

  describe('Regex Parameters', () => {

    it('should respond with dummy-response-2.json for GET with regex pattern', (done) => {
      request.get(helper.getUrl('/v1/route10?a=1'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('should NOT response with dummy-response-2.json for GET with regex pattern', (done) => {
      request.get(helper.getUrl('/v1/route10?a=4'))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.false;
          done();
        });
    });

  });

  describe('Headers', () => {

    it('should respond dummy-response-1.json when GET headers has pair a:1', (done) => {

      request.get(helper.getUrl('/v1/route10'))
        .set('a', '1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'a': 1
          })).to.be.ok;
          done();
        });
    });
  });

});
