
var path = require('path');
var config = require('../config');
var Ekko = require('../index');

var test = {
  ekko: null,
  serverSpecHelper: function(){
    var self = this;

    before(function (done) {
      self.ekko = new Ekko();
      self.ekko.start().then(function () {
        done();
      });
    });

    after(function (done) {
      self.ekko.stop().then(function () {
        done();
      });
    });
  },
  getUrl:  function (endpoint) {
    var url = [':', config.addressInUse.port, endpoint].join('');
    //var url = [':', config.testing.servers.web.port, endpoint].join('');
    return url;
  },
  getFile: function (name){
    var filePath =path.join(__dirname, 'data', name);
    return filePath;
  }
};

module.exports = test;
