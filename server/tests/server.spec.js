/*globals describe, before, after, it*/
var chai = require('chai');
var expect = chai.expect;

var Ekko = require('../index');

describe('Ekko', function () {

  var server;

  before(function(done) {
    server = new Ekko();
    server.start().then(function() {
      done();
    });
  });

  after(function(done) {
    server.stop().then(function() {
      done();
    });
  });

  it('should be defined', function() {
    expect(server).to.be.defined;
  });

});