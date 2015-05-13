var path = require('path');

var config = {

  development: {
    latency: 250,
    session: false,
    token: false,
    user: null,
    cache: 0,
    limit: '50mb',
    urls: {
      prefix: ['/api', '/public/api'],
      home: '/public/apps/demo'
    },
    servers: {
      web: {
        host: "0.0.0.0",
        port: 9999
      }
    },
    data: path.join(__dirname, '/data'),
    routes: path.join(__dirname, '/routes.json')
  },

  production: {
    latency: 300,
    user: null,
    cache: 86400000,
    limit: '50mb',
    servers: {
      web: {
        host: "0.0.0.0",
        port: 9999
      }
    },
    data: path.join(__dirname, '/data'),
    routes: path.join(__dirname, '/routes.json'),
    directory: path.join(__dirname, '/build')
  },

  testing: {
    latency: 0,
    limit: '50mb',
    servers: {
      web: {
        host: "127.0.0.1", // 0.0.0.0 or localhost causes windows tests to fail?
        port: 8888
      },
      api: {
        host: "127.0.0.1",
        port: 7777,
        proxies: [
          {
            context: "/api",
            rewrite: {
              from: "^/api",
              to: ""
            }
          }
        ]
      }
    },
    data: path.join(__dirname, '/server/tests/data'),
    routes: path.join(__dirname, '/server/tests/dummy.routes.config.json')
  }

};

module.exports = config;
