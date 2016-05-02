/* globals describe, it*/
var request = require('superagent');
var helper = require('../../tests/helpers');

describe('Events', function() {

  helper.serverSpecHelper();

  it('should emit an event when a route is undefined', function(done) {
    helper.ekko.on('av:fileNotFound', function() {
      done();
    });

    request.get(helper.getUrl('/dummy/file'))
    .end();
  });
});
