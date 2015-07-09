var _ = require('lodash');
var utils = require('../utils');

var match = {

  scoreHeaders: function(_request, headers) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    var score = 0;
    var _headers = _request.headers;

    _.each(_headers, function(_headerValue, _headerKey) {
      var headerValue = utils.object.deep(headers, _headerKey);

      if(_headerValue ===  headerValue) {
        score++;  // values are equal
      }

    });

    return score;
  },

  scoreParam: function(score, _paramValue, paramValue) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    if(_paramValue ===  paramValue) {
      score.hits++; // perfect match
    }else if(!paramValue) {
      score.misses++; // request config is looking for a param but actual request doesn't have it
    }else {
      score.valid = false; // request config {a:1} not match value of requst params {a:10}
    }
  },

  scoreArray: function(score, _paramValue, paramValue) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    paramValue = _.toArray(paramValue);

    var hits = _.intersection(_paramValue, paramValue);
    score.hits+= hits.length;

    var misses = _.difference(_paramValue, paramValue);
    score.misses+= misses.length;

    return score;

  },

  scoreParams: function(_request, params, method) {

    var self = this;

    // Note: variables prefixed with "_" underscore signify config object|key|value

    var score  = {
      hits: 0, // Matching parameters
      misses: 0, // Parameters specified in route, but not present in query
      valid: true // False if a parameter is specified in route and query, but they are not equal and therefore should never match
    };

    var _params = _request.params;

    _.each(_params, function(_paramValue, _paramKey) {

      var paramValue = (method === 'get') ? params[_paramKey] : utils.object.deep(params, _paramKey);

      if(_.isArray(_paramValue)) {
        self.scoreArray(score, _paramValue, paramValue);
      }else {
        self.scoreParam(score, _paramValue, paramValue);
      }

    });

    return score;

  },

  /**
   * Sets the res.locals.request object that nearly matches to the http request object.
   *
   * @param {[type]} req http request object
   * @param {[type]} res http response object
   */
  set: function(req, res) {

    // Note: variables prefixed with "_" underscore signify config object object|key|value

    var self = this;

    var _route = res.locals.route;
    var method = req.method.toLowerCase();
    var _requests = _route.methods[method];

    var params =  _.isEmpty(req.query) ? req.body : req.query;
    // var headers = req.headers;

    var topScore = {
      hits: 0,
      misses: 0
    };

    // set the default request
    res.locals.request = _requests[0];

    _.each(_requests, function(_request) {

      var score = self.scoreParams(_request, params, method);
      // self.scoreHeaders(score, _request, headers);

      if(!score.valid) {
        return;
      }

      // Top Score:
      //
      //  1. Top hits
      //  2. Unless top hits are equal the one with least amount of misses
      //  3. Unless both hits and misses are equal last configuration should win
      if(score.hits > topScore.hits || (score.hits === topScore.hits && score.misses < topScore.misses || (score.hits === topScore.hits && score.misses === topScore.misses))) {
        topScore.hits = score.hits;
        topScore.misses = score.misses;
        res.locals.request = _request;
      }
    });

  }

};

module.exports = match;
