/* globals describe, it*/
var request = require('superagent');
var helper = require('../../tests/helpers');

describe('Events', function() {

  helper.serverSpecHelper();

  it('should emit an event for all requests when a request is received', function(done) {
    helper.ekko.on('av:request', function() {
      done();
    });

    request.post(helper.getUrl('/v1/route9'))
    .end();
  });

  it('should emit an event when a route is undefined', function(done) {
    helper.ekko.on('av:fileNotFound', function() {
      done();
    });

    request.get(helper.getUrl('/dummy/file'))
    .end();
  });
});
