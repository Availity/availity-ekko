/*globals before, after*/
var path = require('path');
var config = require('../config');
var Ekko = require('../index');

var test = {

  ekko: null,

  serverSpecHelper: function(){

    before(function (done) {
      test.ekko = new Ekko();
      test.ekko.start().then(function () {
        done();
      });
    });

    after(function (done) {
      test.ekko.stop().then(function () {
        done();
      });
    });
  },

  getUrl: function (endpoint) {
    var url = [':', config.addressInUse.port, endpoint].join('');
    return url;
  },

  getFile: function (name){
    var filePath =path.join(__dirname, 'data', name);
    return filePath;
  }
};

module.exports = test;
