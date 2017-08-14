'use strict';

const _ = require('lodash');

const match = {

  scoreHeaders(score, _request, headers) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    const _headers = _request.headers;

    _.each(_headers, (_headerValue, _headerKey) => {
      const headerValue = _.get(headers, _headerKey);

      if (_headerValue === headerValue) {
        score.hits++; // values are equal
      } else if (!headerValue) {
        score.misses--;
      } else {
        score.valid = false;
      }

    });

    return score;
  },

  scoreParam(score, _paramValue, paramValue) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    if (_paramValue === paramValue) {
      score.hits++; // perfect match
    } else if (!paramValue) {
      score.misses++; // request config is looking for a param but actual request doesn't have it
    } else {
      score.valid = false; // request config {a:1} not match value of request params {a:10}
    }
  },

  scorePattern(score, _paramValue, paramValue) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    const regex = new RegExp(_paramValue.pattern, _paramValue.flags || 'i');

    if (regex.test(paramValue)) {
      score.hits++; // perfect match
    } else if (!paramValue) {
      score.misses++; // request config is looking for a param but actual request doesn't have it
    } else {
      score.valid = false; // request config {a:1} not match value of request params {a:10}
    }
  },

  scoreArray(score, _paramValue, __paramValue) {

    // Note: variables prefixed with "_" underscore signify config object|key|value

    const paramValue = _.toArray(__paramValue);

    const hits = _.intersection(_paramValue, paramValue);
    score.hits += hits.length;

    const misses = _.difference(_paramValue, paramValue);
    score.misses += misses.length;

    return score;

  },

  scoreParams(_request, params, method) {

    const self = this;

    // Note: variables prefixed with "_" underscore signify config object|key|value

    const score = {
      hits: 0, // Matching parameters
      misses: 0, // Parameters specified in route, but not present in query
      valid: true // False if a parameter is specified in route and query, but they are not equal and therefore should never match
    };

    const _params = _request.params;

    _.each(_params, (_paramValue, _paramKey) => {

      const paramValue = (method === 'get') ? params[_paramKey] : _.get(params, _paramKey);

      if (_.isArray(_paramValue)) {
        self.scoreArray(score, _paramValue, paramValue);
      } else if (_.isObject(_paramValue) && _paramValue.pattern) {
        self.scorePattern(score, _paramValue, paramValue);
      } else {
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
  set(req, res) {

    // Note: variables prefixed with "_" underscore signify config object object|key|value

    const self = this;

    const _route = res.locals.route;
    const method = req.method.toLowerCase();
    const _requests = _route.methods[method];

    const params = _.isEmpty(req.query) ? req.body : req.query;
    // const headers = req.headers;

    const topScore = {
      hits: 0,
      misses: 0
    };

    // set the default request
    res.locals.request = _requests[0];

    _.each(_requests, (_request) => {

      const score = self.scoreParams(_request, params, method);
      self.scoreHeaders(score, _request, req.headers);

      if (!score.valid) {
        return;
      }

      // Top Score:
      //
      //  1. Top hits
      //  2. Unless top hits are equal the one with least amount of misses
      //  3. Unless both hits and misses are equal last configuration should win
      if (score.hits > topScore.hits || (score.hits === topScore.hits && score.misses < topScore.misses || (score.hits === topScore.hits && score.misses === topScore.misses))) {
        topScore.hits = score.hits;
        topScore.misses = score.misses;
        res.locals.request = _request;
      }
    });

  }

};

module.exports = match;
