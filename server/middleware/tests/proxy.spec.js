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
    var proxy;

    before(function (done) {

      config.testing.servers.api.proxy = true;

      var express = require('express');
      proxy = express();
      var router = express.Router();
      router.all('/v1/route1', function (req, res) {
        res.json({z: 36});
      });

      proxy.use('/api', router);

      proxy.listen(config.testing.servers.api.port, function () {
        done();
      });

    });

    after(function (done) {
      config.testing.servers.api.proxy = false;
      proxy.close(function () {
        done();
      });
    });

    it('should get a response from /api/v1/route1', function(done) {

      request.get([':', config.testing.servers.api.port, '/api/v1/route1'].join(''))
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          //expect(res.body).to.equal({'z':36});
          expect(_.isEqual(res.body,{'z': 36})).to.be.ok;
          done();
        });
    });

  });
});
