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
        done();
      });
    });

    afterEach(function (done) {
      test.ekko.stop().then(function () {
        done();
      });
    });
  },

  getUrl: function (endpoint) {
    var url = [':', config.server.address().port, endpoint].join('');
    return url;
  },

  getFile: function (name) {
    var filePath =path.join(__dirname, 'data', name);
    return filePath;
  }
};

module.exports = test;
