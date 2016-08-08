'use strict';

const path = require('path');

const config = {

  latency: 0,
  limit: '50mb',
  user: 'testuser',
  servers: {
    web: {
      host: '127.0.0.1' // 0.0.0.0 or localhost causes windows tests to fail?
    },
    api: {
      host: '127.0.0.1',
      port: 7777,
      proxy: true,
      proxies: [
        {
          context: '/api',
          rewrite: {
            from: '^/api',
            to: ''
          }
        },
        {
          context: '/ui',
          rewrite: {
            from: '^/ui',
            to: '/v1'
          }
        },
        {
          context: '/services'
        }
      ]
    },
    other: {
      host: '127.0.0.1',
      port: 9999,
      proxy: true,
      headers: {
        RemoteUser: 'otheruser'
      },
      proxies: [
        {
          context: '/test1',
          rewrite: {
            from: '^/test1',
            to: ''
          }
        },
        {
          headers: {
            custom1: 'abc123'
          },
          context: '/public/api',
          rewrite: {
            from: '^/public/api',
            to: ''
          }
        }
      ]
    }
  },
  data: path.join(__dirname, '/data'),
  routes: path.join(__dirname, '/dummy.routes.config.json')

};

module.exports = config;
