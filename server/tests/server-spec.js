const chai = require('chai');
const path = require('path');

const { expect }  = chai.expect;

const Ekko = require('../index');

describe('Ekko', () => {
  it('should be defined', () => {
    expect(Ekko).to.be.exist;
  });

  describe('Events', () => {
    it('should emit started event when started', done => {
      const ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      ekko.on('av:started', () => {
        ekko.stop().then(() => {
          done();
        });
      });
      ekko.start();
    });

    it('should emit stopped event when stopped', done => {
      const ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      ekko.on('av:stopped', () => {
        done();
      });
      ekko.start().then(() => {
        ekko.stop();
      });
    });
  });
});
