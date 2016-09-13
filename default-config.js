'use strict';

const path = require('path');

const config = {

  latency: 250,
  user: null,
  cache: 0,
  limit: '50mb',
  urls: {
    prefix: ['/api', '/public/api'],
    home: '/public/apps/demo'
  },
  servers: {
    web: {
      host: '0.0.0.0',
      port: 9999
    }
  },
  data: path.join(__dirname, '/data'),
  routes: path.join(__dirname, '/routes.json')

};

module.exports = config;
