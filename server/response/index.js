var get = require('./get');
var post = require('./post');

var response = {

  get: get.send,

  delete: get.send,

  post: post.send,

  put: post.send,

  send: function(req, res, next) {

    var method = req.method.toLowerCase();

    if (this[method]) {
      this[method](req, res, next);
      return;
    }

    next();
  }
};

module.exports = response;
