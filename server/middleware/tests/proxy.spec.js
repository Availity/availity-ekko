/*globals describe, before, after, it*/
var request = require('superagent');
var chai = require('chai');
var _ = require('lodash');
var helper = require('../../tests/helpers');
var config = require('../../../config');
var expect = chai.expect;
process.env.NODE_ENV = 'testing';


describe('Ekko |', function () {
  helper.serverSpecHelper();

  describe('proxy |', function(){
    var proxy1;
    var proxy2;

    before(function (done) {

      config.testing.servers.api.proxy = true;

      var express = require('express');
      proxy1 = express();

      proxy1.get('/v1/route1', function (req, res) {
        res.json({z: 36});
      });

      proxy2 = express();

      proxy2.get('/v2/route2', function(req, res) {
        res.json({y: 35});
      })

      proxy1.listen(config.testing.servers.api.port, function () {
        proxy2.listen(config.testing.servers.test.port, function() {
          done();
        });
      });

    });

    after(function (done) {
      config.testing.servers.api.proxy = false;
      config.testing.servers.test.proxy = false;
      //done();

      if(proxy1 && proxy1.close){

        proxy1.close(function(){

          if(proxy2 && proxy2.close){
            proxy2.close(function() {
              done();
            });
          }else {
            done();
          }

        });
      }else{
        done();
      }
    });

    it('should get a response from /api/v1/route1', function(done) {

      request.get(helper.getUrl('/api/v1/route1'))
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body,{'z': 36})).to.be.ok;
          done();
        });
    });

    it('should rewrite /ui/route1 and proxy to /v1/route1', function(done) {
      request.get(helper.getUrl('/ui/route1'))
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body,{'z': 36})).to.be.ok;
          done();
        });
    });

    it('should get a response from /test/v2/route2', function(done) {

     request.get(helper.getUrl('/test/v2/route2'))
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(_.isEqual(res.body,{'y': 35})).to.be.ok;
          done();
        });
    });

  });

});
