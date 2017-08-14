/* globals describe, it */
'use strict';

const request = require('superagent');
const chai = require('chai');
const helper = require('../../tests/helpers');
const expect = chai.expect;

describe('Behavior', () => {

  helper.serverSpecHelper();

  it('should respond with 404 for undefined route', (done) => {

    request.get(helper.getUrl('/dummy/route'))
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });

  });

  it('should respond with 404 when file does not exist', (done) => {

    request.get(helper.getUrl('/bad/file'))
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });

  });

  describe('Events', () => {

    it('should emit file not found event when file does not exist', (done) => {
      helper.ekko.on('av:fileNotFound', () => {
        done();
      });

      request.get(helper.getUrl('/bad/file'))
        .end();
    });

    it('should emit response event when file exists', (done) => {
      helper.ekko.on('av:response', () => {
        done();
      });

      request.get(helper.getUrl('/v1/route1'))
        .end();
    });

  });

});
