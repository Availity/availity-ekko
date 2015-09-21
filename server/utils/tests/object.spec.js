/* globals describe, it*/

var object = require('../object');
var chai = require('chai');
var expect = chai.expect;

describe('Object', function() {

  var obj1 = {
    a: {
      b: {
        c: 'd'
      }
    }
  };

  var obj2 = {
    a: {
      b: {
        c: {
          d: ['e', 'f', 'g']
        }
      }
    }
  };

  var arr = [{
    deeply: {
      nested: 'foo'
    }
  }, {
    deeply: {
      nested: 'bar'
    }
  }];

  it('should get deep value', function() {

    var value = object.deep(obj1, 'a.b.c');
    expect(value).to.equal('d');

    value = object.deep(obj2, 'a.b.c.d[2]');
    expect(value).to.equal('g');
  });

  it('should not throw error getting invalid deep value', function() {
    expect(function() {
      object.deep(obj1, 'z.y.g');
    }).to.not.throw(Error);
  });

  it('should pluck deep values', function() {
    var values = object.pluckDeep(arr, 'deeply.nested'); // ['foo', 'bar']
    expect(values).to.eql(['foo', 'bar']);
  });

});
