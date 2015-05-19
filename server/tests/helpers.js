/*globals beforeEach, afterEach */
var path = require('path');
var config = require('../config');
var Ekko = require('../index');
process.env.NODE_ENV = 'testing';

var test = {
  ekko: null,

  serverSpecHelper: function() {

    beforeEach(function (done) {
      test.ekko = new Ekko();
      test.ekko.start().then(function () {
        console.log('starting ekko server');
        done();
      });
    });

    afterEach(function (done) {
      test.ekko.stop().then(function () {
        console.log('closing ekko server');
        done();
      });
    });
  },

  getUrl: function (endpoint) {
    var url = [':', config.addressInUse.port, endpoint].join('');
    return url;
  },

  getLongUrl: function (endpoint) {
    var url = ['http://127.0.0.1:', config.addressInUse.port, endpoint].join('');
    console.log('url: ' , url);
    return url;
  },

  getFile: function (name) {
    var filePath =path.join(__dirname, 'data', name);
    return filePath;
  }
};

module.exports = test;
