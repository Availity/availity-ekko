/*globals describe, before, after, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var path = require('path');
var helper = require('../../tests/helpers');
var expect = chai.expect;
process.env.NODE_ENV = 'testing';


describe('Ekko | behavior |', function () {
  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', function (done) {
    request.get(helper.getUrl('/dummy/route'))
      .end(function(err,res){
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should respond with 404 when file does not exist', function (done) {
    request.get(helper.getUrl('/bad/file'))
      .end(function (err, res) {
        expect(res.status).to.equal(404);
        done();
      });
  });

});
