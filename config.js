var path = require('path');

var config = {

  development: {
    latency: 250,
    session: false,
    token: false,
    user: null,
    cache: 86400000,
    limit: '20mb',
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
    limit: '50mb',
    servers: {
      web: {
        host: "0.0.0.0",
        port: 9999
      }
    },
    data: path.join(__dirname, '/data'),
    routes: path.join(__dirname, '/routes.json')
  },

  testing: {
    latency: 0,
    user: null    ,
    servers: {
      web: {
        host: "0.0.0.0",
        port: 8888
      }
    },
    data: path.join(__dirname, '/data'),
    routes: path.join(__dirname, '/routes.json')
  }

};

module.exports = config;