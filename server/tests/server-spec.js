/* globals describe, it */
var chai = require('chai');
var expect = chai.expect;

var Ekko = require('../index');

describe('Ekko', function() {
  it('should be defined', function() {
    expect(Ekko).to.be.defined;
  });

  describe('Events', function() {

    it('should emit started event when started', function(done) {
      var ekko = new Ekko();
      ekko.on('av:started', function() {
        ekko.stop().then(function() {
          done();
        });
      });
      ekko.start();
    });

    it('should emit stopped event when stopped', function(done) {
      var ekko = new Ekko();
      ekko.on('av:stopped', function() {
        done();
      });
      ekko.stop();
    });
  });
});
