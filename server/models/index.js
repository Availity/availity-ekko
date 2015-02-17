var _ = require('lodash');


//-- Request

var Request = function() {
  this.params = null;
  this.headers = null;
  this.responses = [];
  this.id = _.uniqueId('request');
};

Request.prototype.addResponse = function(response) {
  this.responses.push(response);
};

//-- Response

var Response = function(response) {
  this.headers = null;
  this.file = null;
  this.url = null;
  this.status = null;

  if(response) {
    _.extend(this, response);
  }

  this.id = _.uniqueId('response');
};

//-- Route

var Route = module.exports = function(url, endpoint) {
  this.url = url;
  this.methods = {};
  this.id = _.uniqueId('route');

  this.init(endpoint);
};

Route.prototype.init = function(endpoint) {

  var self = this;

  // Allow for mime type extension in the url like /v1/users/me.json
  this.url = this.url + '.:format?';
  this.url = this.url.charAt(0) !== '/' ? '/' + this.url : this.url;

  // Attach default file response for each http method
  _.each(['get', 'post', 'put', 'delete', 'head', 'patch'], function(method) {
    self.addMethod(method, endpoint);
  });

};

Route.prototype.addMethod = function(method, endpoint) {

  var self = this;

  if(!this.methods[method]) {
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
  var response = new Response();
  response.file = endpoint.file;
  response.url = endpoint.url;
  response.latency = endpoint.latency;
  response.status = endpoint.status;

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
  if(_.isString(endpoint[method])) {
    response.file = endpoint[method];
  }

  var request = new Request();
  request.addResponse(response);
  this.methods[method].push(request);

  // "get": [
  //   {
  //     "file": "example2.json",
  //     ...
  //   }...
  if(_.isArray(endpoint[method])) {

    _.each(endpoint[method], function(_request) {

      // Handle default response.
      //
      // EX:
      //
      // "post": [
      //   {
      //     "file": "example2.json"
      //   }
      // ]
      if(!_request.params && !_request.headers) {

        // If necessary, override the default response from the routes global response.
        if(self.methods[method][0]) {
          self.methods[method][0].responses[0].file = _request.file;
          self.methods[method][0].responses[0].url  = _request.file;
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
      if(_request.file || _request.url || _request.status) {
        response = new Response();
        response.file = _request.file;
        response.url = _request.url;
        response.status  = _request.status;
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
      if(_.isArray(_request.response)) {
        _.each(_request.response, function(_response) {
          var r = new Response(_response);
          request.responses.push(r);
        });
      }

      self.methods[method].push(request);

    });
  }



};

module.exports = {
  Request: Request,
  Response: Response,
  Route: Route
};

