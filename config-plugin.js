'use strict';

const config = {

  latency: 250,
  cache: 0,
  limit: '50mb',
  host: '0.0.0.0',
  port: 9999,
  plugins: [
    'availity-mock-data'
  ],
  pluginContext: 'http://localhost:3000'

};

module.exports = config;
