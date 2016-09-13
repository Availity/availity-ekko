/* globals describe, it */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const Ekko = require('../index');

describe('Ekko', function() {
  it('should be defined', function() {
    expect(Ekko).to.be.defined;
  });

  describe('Events', function() {

    it('should emit started event when started', function(done) {
      const ekko = new Ekko();
      ekko.on('av:started', function() {
        ekko.stop().then(function() {
          done();
        });
      });
      ekko.start();
    });

    it('should emit stopped event when stopped', function(done) {
      const ekko = new Ekko();
      ekko.on('av:stopped', function() {
        done();
      });
      ekko.start().then(function() {
        ekko.stop();
      });
    });
  });
});
