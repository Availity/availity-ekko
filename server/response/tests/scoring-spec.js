/* globals describe, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var expect = chai.expect;


describe('Scoring', function() {

  helper.serverSpecHelper();

  describe('Parameters', function() {

    it('route 3 should respond with dummy-response2.json for GET with partial parameters', function(done) {
      request.get(helper.getUrl('/v1/route3?param1=1'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response2.json for GET with specified parameters', function(done) {
      request.get(helper.getUrl('/v1/route3?param1=1&param2=2'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response3.json for GET with \'.\' in parameters', function(done) {
      request.get(helper.getUrl('/v1/route3?param1=1&param2=2&param3=3'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'c': 3
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response3.json for GET with specified parameters', function(done) {
      request.get(helper.getUrl('/v1/route3?param1.2=abc'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'c': 3
          })).to.be.ok;
          done();
        });
    });

    it('route 3 should respond with dummy-response4.json for GET with no matching parameters', function(done) {
      request.get(helper.getUrl('/v1/route3?param1=452'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'd': 4
          })).to.be.ok;
          done();
        });
    });

    it('should respond with base file for undefined query route', function(done) {
      request.get(helper.getUrl('/internal/v2/route2?dummy=true'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });
  });

  describe('Array Parameters', function() {

    it('should respond with dummy-response-2.json for GET with 3 matching params (1 non-array, 2 array)', function(done) {
      request.get(helper.getUrl('/v1/route4?param1=a&param2=c&param2=d'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('should respond with dummy-response-3.json for GET with 4 matching params (2 array, 2 array)', function(done) {
      request.get(helper.getUrl('/v1/route4?param1=a&param1=b&param2=c&param2=d'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'c': 3
          })).to.be.ok;
          done();
        });
    });

    it('should respond with dummy-response-4.json for GET with 2 matching params (2 array)', function(done) {
      request.get(helper.getUrl('/v1/route4?param2=c&param2=d'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'd': 4
          })).to.be.ok;
          done();
        });
    });

    it('should respond dummy-response-4.json when GET request has query params but the configuration for queries is undefined', function(done) {
      request.get(helper.getUrl('/no/params?param1=a&param2=b'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'd': 4
          })).to.be.ok;
          done();
        });
    });
  });

  describe('Regex Parameters', function() {

    it('should respond with dummy-response-2.json for GET with regex pattern', function(done) {
      request.get(helper.getUrl('/v1/route10?a=1'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.ok;
          done();
        });
    });

    it('should NOT response with dummy-response-2.json for GET with regex pattern', function(done) {
      request.get(helper.getUrl('/v1/route10?a=4'))
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body, {
            'b': 2
          })).to.be.false;
          done();
        });
    });

  });

  describe('Headers', function() {

    it('should respond dummy-response-1.json when GET headers has pair a:1', function(done) {

      request.get(helper.getUrl('/v1/route10'))
        .set('a', '1')
        .end(function(err, res) {
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
