'use strict';

const headers = require('./headers');
const development = require('./development');
const production = require('./production');
const testing = require('./testing');

module.exports = {

  headers: headers,
  development: development,
  production: production,
  testing: testing

};
