/* globals beforeEach, afterEach */
'use strict';

process.env.NODE_ENV = 'testing';

const path = require('path');
const config = require('../config');
const Ekko = require('../index');

const test = {

  ekko: null,

  serverSpecHelper() {

    beforeEach(function(done) {
      test.ekko = new Ekko(path.join(__dirname, 'test-config.js'));
      test.ekko.start().then(function() {
        done();
      });
    });

    afterEach(done => {
      test.ekko.stop().then(() => {
        done();
      });
    });
  },

  getUrl(endpoint) {
    const url = [':', config.server.address().port, endpoint].join('');
    return url;
  },

  getFile(name) {
    const filePath = path.join(__dirname, 'data', name);
    return filePath;
  }
};

module.exports = test;
