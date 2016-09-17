'use strict';

const _ = require('lodash');

// Request
class Request {

  constructor() {
    this.params = null;
    this.headers = null;
    this.responses = [];
    this.id = _.uniqueId('request');
  }

  addResponse(response) {
    this.responses.push(response);
  }
}

// Response
class Response {

  constructor(response) {

    this.headers = null;
    this.file = null;
    this.url = null;
    this.latency = null;
    this.status = null;
    this.repeat = 1;

    if (response) {
      this.set(response);
    }

    this.id = _.uniqueId('response');
  }

  set(response) {
    this.headers = response.headers || this.headers;
    this.file = response.file || this.file;
    this.url = response.url || this.url;
    this.latency = response.latency || this.latency;
    this.status = response.status || this.status;
    this.repeat = response.repeat || this.repeat;
  }
}

// -- Route

class Route {
  constructor(url, endpoint, dataPath) {
    this.url = url;
    this.methods = {};
    this.id = _.uniqueId('route');
    this.dataPath = dataPath;

    this.init(endpoint);
  }

  init(endpoint) {

    // Allow for mime type extension in the url like /v1/users/me.json
    this.url = this.url + '.:format?';
    this.url = this.url.charAt(0) !== '/' ? '/' + this.url : this.url;

    // Attach default file response for each http method
    _.each(['get', 'post', 'put', 'delete', 'head', 'patch'], (method) => {
      this.addMethod(method, endpoint);
    });

  }

  addMethod(method, endpoint) {

    if (!this.methods[method]) {
      // creates property get|post|put|delete... on route object
      this.methods[method] = [];
    }

    // Handle simple config that defines a file response for all methods
    //
    // EX:
    //
    // "v2/route2": {
    //   "latency": 250,
    //   "file": "example2.json"
    // }
    let response = new Response();
    response.set(endpoint);

    // Handle the syntactic sugar case where you can just define a method
    // and a file response in one line.
    //
    // EX:
    //
    // "v1/route4": {
    //   "get": "example1.json",
    //   "put": "example2.json",
    //   "post": "example3.json",
    //   "delete": "example4.json"
    // }
    if (_.isString(endpoint[method])) {
      response.file = endpoint[method];
    }

    let request = new Request();
    request.addResponse(response);
    this.methods[method].push(request);

    // "get": [
    //   {
    //     "file": "example2.json",
    //     ...
    //   }...
    if (_.isArray(endpoint[method])) {

      _.each(endpoint[method], (_request) => {

        // Handle default response.
        //
        // EX:
        //
        // "post": [
        //   {
        //     "file": "example2.json"
        //   }
        // ]
        if (!_request.params && !_request.headers && !_.isArray(_request.response)) {

          // If necessary, override the default response from the routes global response.
          if (this.methods[method][0]) {
            this.methods[method][0].responses[0].set(_request);
            // this.methods[method][0].responses[0].url  = _request.file;
          }

          return;
        }

        // {
        //   "file": "example3.json",
        //   "status": 202,
        //   "params": {
        //     "a": 1,
        //     "b": "sample.pdf"
        //   }
        // }
        request = new Request();
        request.params = _request.params;
        request.headers = _request.headers;
        // if a request configuration has both a file and response attribute defined, ignore the file
        // attribute and continue...this is most likely an async configuration
        if ((_request.file || _request.url || _request.status) && !_.isArray(_request.response)) {
          response = new Response(_request);
          request.responses.push(response);
        }

        // "response": [
        //   {
        //     "status": 202,
        //     "file": "example1.json"
        //   },
        //   {
        //     "status": 201,
        //     "file": "example2.json"
        //   }
        // ]...
        if (_.isArray(_request.response)) {
          _.each(_request.response, (_response) => {
            const __response = new Response(_request);
            __response.set(_response);
            request.responses.push(__response);
          });
        }

        this.methods[method].push(request);

      });
    }
  }
}

module.exports = {
  Request,
  Response,
  Route
};

