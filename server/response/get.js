var match = require('./match');
var result = require('./result');

var get =  {

  send: function(req, res) {
    match.set(req, res);
    result.send(req, res);
  }

};

module.exports = get;
