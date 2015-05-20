/*globals describe, it*/
var chai = require('chai');
var expect = chai.expect;

var Ekko = require('../index');

describe('Ekko', function () {
  it('should be defined', function () {
    expect(Ekko).to.be.defined;
  });
});
