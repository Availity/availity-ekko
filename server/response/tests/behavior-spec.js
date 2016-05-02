/* globals describe, it */
var request = require('superagent');
var chai = require('chai');
var helper = require('../../tests/helpers');
var expect = chai.expect;

describe('Behavior', function() {

  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', function(done) {
    request.get(helper.getUrl('/dummy/route'))
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should respond with 404 when file does not exist', function(done) {
    request.get(helper.getUrl('/bad/file'))
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        done();
      });
  });

  describe('Events', function() {

    it('should emit file not found event when file does not exist', function(done) {
      helper.ekko.on('av:fileNotFound', function() {
        done();
      });

      request.get(helper.getUrl('/bad/file'))
      .end();
    });

    it('should emit response event when file exists', function(done) {
      helper.ekko.on('av:response', function() {
        done();
      });

      request.get(helper.getUrl('/v1/route1'))
      .end();
    });

  });

});
