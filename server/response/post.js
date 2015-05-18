var _ = require('lodash');
var BPromise = require('bluebird');
var fs = require("fs");
var match = require('./match');
var result = require('./result');

var post =  {

  multipart: function(req) {

    return new BPromise(function (resolve, reject) {

      if(!req.is('multipart')) {
        resolve(true);
        return;
      }

      req.busboy.on('file', function(fieldname, file, filename) {

        // Treat the file name as a field so we can match and score
        req.body[fieldname] = filename;

        // `file` is a `ReadableStream`...always do something with it
        // else busboy won't fire the 'finish' even.  At minimum do:
        file.resume();
        //var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
        //file.pipe(fs.createWriteStream('C:/Users/kpowers/Desktop/sample.txt'));
      });

      req.busboy.on('field', function(key, value) {
        if(_.isEmpty(value)) {
          return;
        }

        console.log(key + ", " + value);

        req.body[key] = value;
      });

      req.busboy.on('error', function(err) {
        reject(err);
      });

      req.busboy.on('finish', function() {
        resolve(true);
      });

      req.pipe(req.busboy);

    });

  },

  send: function(req, res) {
    post.multipart(req).then(function() {
      match.set(req, res);
      result.send(req, res);
    });
  }
};

module.exports = post;
