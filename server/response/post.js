var _ = require('lodash');
var BPromise = require('bluebird');

var logger = require('../logger');
var match = require('./match');
var result = require('./result');

var post = {

  multipart: function(req) {

    return new BPromise(function(resolve, reject) {

      if (!req.is('multipart')) {
        resolve(true);
        return;
      }

      req.busboy.on('file', function(fieldname, file, filename) {

        file.on('error', function(error) {
          logger.error('{red:Something went wrong uploading the file', error);
        });
        file.on('end', function() {
          // Treat the file name as a field so we can match and score
          logger.info('File finished %s:', filename);
          req.body[fieldname] = filename;
        });
        // `file` is a `ReadableStream`...always do something with it
        // else busboy won't fire the 'finish' even.  At minimum do:
        file.resume();
      });

      req.busboy.on('field', function(key, value) {
        if (_.isEmpty(value)) {
          return;
        }

        logger.info(key + ', ' + value);

        req.body[key] = value;
      });

      req.busboy.on('error', function(err) {
        logger.error(err);
        reject(err);
      });

      req.busboy.on('finish', function() {
        logger.info('finished request');
        resolve(true);
      });

      req.pipe(req.busboy);

    });

  },

  send: function(req, res) {
    post.multipart(req).then(function() {
      match.set(req, res);
      result.send(req, res);
    }, function() {
      res.status(500).send({ error: 'mock server error' });
    });
  }
};

module.exports = post;
