var headers = require('./headers');
var events = require('./events');
var development = require('./development');
var production = require('./production');
var testing = require('./testing');

module.exports = {

  headers: headers,
  events: events,
  development: development,
  production: production,
  testing: testing

};
