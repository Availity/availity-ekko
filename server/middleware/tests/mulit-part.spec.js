/*globals describe, before, after, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var BPromise = require('bluebird');

var expect = chai.expect;

process.env.NODE_ENV = 'testing';

var config = require('../../../config');
var Ekko = require('../../index');

var getUrl = function (endpoint) {
  var url =  [':', config.testing.servers.web.port, endpoint].join('');
  return url;
};


describe.only('Ekko | multi-part |', function () {

  var ekko;

  before(function (done) {
    ekko = new Ekko();
    ekko.start().then(function () {
      done();
  });
  });

  after(function (done) {
    ekko.stop().then(function () {
      done();
    });
  });

  //multi-part

  it('should respond with dummy-response-1.json for empty form fields and one file attachment', function (done) {
    this.timeout(10000);
    var file = path.join(path.dirname(__dirname), '..',  'tests/data/dummy-response-1.json');

    request.post(getUrl('/v1/route5'))
      .type('multipart/form-data')
      .attach('attatchment', file)
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res.status).to.equal(200);
        var isEqual = _.isEqual(res.body, {'a': 1});
        expect(isEqual).to.be.ok;
        done();
      });
  });

  /*it('should respond with dummy-response-2.json for empty form fields and one file attachment', function (done) {

    request.post(getUrl('/v1/route5'))
      .
    var r = request.post(options, function (error, response, body) {
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
      expect(isEqual).to.be.ok;
      done();
    });

    var form = r.form();
    form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-2.json')));
  });*/

  /*


  it('should respond with dummy-response-2.json for empty form fields and one file attachment', function (done) {

    var r = request.post(options, function (error, response, body) {
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
      expect(isEqual).to.be.ok;
      done();
    });

    var form = r.form();
    form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-2.json')));
  });

  it('should respond with dummy-response-2.json for 1 matching form field and one file attachment', function (done) {

    var r = request.post(options, function (error, response, body) {
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      var isEqual = _.isEqual(JSON.parse(body), {'b': 2});
      expect(isEqual).to.be.ok;
      done();
    });

    var form = r.form();
    form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-2.json')));
    form.append('a', '1');
  });

  it('should respond with dummy-response-3.json for 2 matching form fields and one file attachment', function (done) {

    var r = request.post(options, function (error, response, body) {
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      var isEqual = _.isEqual(JSON.parse(body), {'c': 3});
      expect(isEqual).to.be.ok;
      done();
    });

    var form = r.form();
    form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-3.json')));
    form.append('a', 1);
    form.append('b', 2);
  });

  it('should respond with dummy-response-4.json for field name that matches file input name', function (done) {

    var r = request.post(options, function (error, response, body) {
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      var isEqual = _.isEqual(JSON.parse(body), {'d': 4});
      expect(isEqual).to.be.ok;
      done();
    });

    var form = r.form();
    form.append('attachment', fs.createReadStream(path.join(__dirname, 'data/dummy-response-4.json')));
  });*/
});
