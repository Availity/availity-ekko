# availity-ekko

> Mock server simulating Availity API rest services

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&label=license)](http://opensource.org/licenses/MIT)
[![NPM](http://img.shields.io/npm/v/availity-ekko.svg?style=flat-square&label=npm)](https://npmjs.org/package/availity-ekko)
[![Dependency Status](https://img.shields.io/david/Availity/availity-ekko.svg?style=flat-square)](https://david-dm.org/Availity/availity-ekko)
[![Linux Passing](https://img.shields.io/travis/Availity/availity-ekko.svg?style=flat-square&label=linux)](https://travis-ci.org/Availity/availity-ekko)
[![Windows Passing](https://img.shields.io/appveyor/ci/robmcguinness/availity-ekko.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/robmcguinness/availity-ekko)

# Table of Contents

  * [Intro](#intro)
  * [Server Configuration](#server-configuration)
  * [Route Configuration](#route-configuration)
  * [Events](#events)
  * [Contributing](#contributing)
  * [Authors](#authors)
  * [Disclaimer](#disclaimer)
  * [License](#license)


## Intro

Develop web applications without heavy back-end services by running Express middleware or http server which can deliver mock responses.

Responses can be JSON or other formats to simulate REST services. Access-Control HTTP Headers are set by default to allow CORS requests. Mock services are configured in the [routes.json](./routes.json) file.

This server can return other file types besides XML or JSON (PDFs, images, etc).  The appropriate response headers will be automatically set for different file types.  For a complete list of file types supported view the [mime types here](https://github.com/jshttp/mime-db/blob/88d8b0424d93aefef4ef300dc35ad2c8d1e1f9d4/db.json).

## Route Matching

Ekko is designed to respond with the route definition that most closely matches the incoming request by introspecting the request body, parameters and headers. Ekko calculates which route scores the highest for each request and returns the appropriate mock response.

## Configuration

### Standalone Server

The default server configuration can be found in [config.js](./config.js).  Pass a different configuration file to the Ekko server to override the defaults.

```javascript
const path = require('path');
const Ekko = require('availity-ekko');

const configPath = path.join(__dirname, 'path/to/config.js');
const ekko = new Ekko(configPath);
ekko.start();
```

Alternatively, pass options in the start method.

```javascript
const ekko = new Ekko();
ekko.start({
    data: path.join(__dirname, './data'),
    routes: path.join(__dirname, './routes'),
    plugins: ['availity-mock-data']
}).then(function() {
    // server started
});
```

### Express Middleware
```js
const express = require('express');
const app = express();

// This is the same as the stand-alone server use.
const Ekko = require('availity-ekko');
const ekko = new Ekko({/* options */});

app.use(ekko.middleware(/* options, same as `start` */);

app.listen(3001);
```

## Options

- **latency**: Global delay for all reponses.  The latency can be overridden per route configuration.  Default is `250ms`.
- **limit**: Upload max size.  Default is `50mb`,
- **host**: Server binds and listens for connections on the specified host. Default is `0.0.0.0`.
- **port**: Server binds and listens for connections on the specified port.  Default is `9999`.
- **data**: Path to folder that contains the json mock responses.
- **routes**: Path(s) to configuration file that contains a mapping of the request/response routes.  Multiple paths can be passed in with an array of strings.
- **plugins**: Array of NPM module names that enhance Ekko with additional data and routes.  @See [availity-mock-data](https://github.com/Availity/availity-mock-data)
- **logProvider**: Function that returns a logger that is used in place of the default logger.  Inspired by the log provider in [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

**Simple**
```js

function logProvider(provider) {
    return require('winston');
}
```

**Advanced**
```js

function logProvider(provider) {

    var logger = new (require('winston').Logger)();

    var myCustomProvider = {
        log: logger.log,
        debug: logger.debug,
        info: logger.info,
        warn: logger.warn,
        error: logger.error
    }
    return myCustomProvider;
}
```

## Route Configuration

The `routes.json` defines the mock responses for rest services. Below are some sample scenarios that should help you understand the configuration options.

The mock configuration supports deep nested introspection of JSON and multi-part form data when matching routes. See [Example 6](#example-6-post-with-params-with-deep-introspection) below.

###### Simple

```javascript
"v1/route1": {
  "file": "example1.json" // response for GET|PUT|POST|DELETE
}
```

###### Status Code

```javascript
"v1/route2": {
  "latency": 250, // latency in (ms)
  "file": "example2.json", // all GET|PUT|POST|DELETE requests
  "status": 201 // return status code 201
}
```

###### POST with Default Response

```javascript
"v1/route3": {
  "file": "example3.json", // GET|PUT|DELETE requests
  "post": "example1.json" // POST requests
}
```

###### CRUD

```javascript
"v1/route4": {
  "get": "example1.json", // all GET requests
  "put": "example2.json", // all PUT requests
  "post": "example3.json", // all POST requests
  "delete": "example4.json" // all DELETE requests
}
```

###### Query Params with Arrays and Regexes

```javascript
"v1/route5": {
  "file": "example1.json", // all POST|PUT|DELETE requests
  "get": [
    {
      "file": "example2.json",
      "status": 200, // default status code is 200
      "params": { // GET /v1/router?a=1&b=2&c=3
        "a": "1",
        "b": "2",
        "c": "3"
      }
    },
    {
      "file": "example3.json",
      "params": { // GET /v1/router?a=1&a=2&a=3&a=4
        "a": [1, 2, 3, 4]
      }
    },
    {
      "file": "example4.json",
      "params": { // Regular expression configruation for matching params
        "a": { // GET /v1/router?a=1 OR /v1/router?a=2 OR /v1/router?a=3
            pattern: "1|2|3",
            flags: "i" // Javascript regex flags to ignore case
        }
      }
    },
  ]
}
```

###### POST Params

```javascript
"v1/route6": {
  "file": "example1.json", // all GET|PUT|DELETE requests
  "post": [
    {
      "file": "example2.json",
      "params": { // POST with JSON payload {"a": 1}
        "a": 1
      }
    },
    {
      "file": "example3.json",
      "params": { // POST with JSON payload {a: {b: {c: "1"} } }
        "a.b.c": 1 // nested attributes supported
      }
    },
    {
      "file": "example4.json",
      "params": { // POST with JSON payload {a : {b: [0,1,2] } }
        "a.b[2]": 2 // nested array attributes supported
      }
    }
  ]
},
```

###### Multipart

```html
<form action="/api/v1/users" method="post" enctype="multipart/form-data">
  <p><input type="text" name="a" value="example">
  <p><input type="file" name="b"> <!--the name of the file is used below to match and score the proper response -->
  <p><button type="submit">Submit</button>
</form>
```

```javascript
"v1/route7": {
  "file": "example1.json", // all GET|PUT|DELETE requests
  "post": [
    {
      "file": "example2.json" // default response if none match below
    },
    {
      "file": "example3.json",
      "params": { // form submit where form fields a=1 and b="sample.pdf"
        "a": 1,
        "b": "sample.pdf"
      }
    },
    {
      "file": "example4.json",
      "params": { // form submit where form fields a=2 and b="another.name.jpg"
        "a": 2,
        "b": "another.name.jpg"
      }
    }
  ]
}
```

###### Async Responses

```javascript
"v1/route8": {
  "file": "example1.json",
  "get": [
    {
      "file": "example1.json",
      "response": [
        {
          // first GET request to /v1/route8
          "status": 202,
          "file": "example1.json"
        },
        {
          // second GET request to /v1/route8
          "status": 201,
          "file": "example2.json"
        }
      ]
    }
  ]
}
```

###### Async Responses with Repeat Option

```javascript
"v1/route10": {
    "get": [
      {
        "file": "example1.json",
        "response": [
          {
            "status": 202,
            "file": "example1.json",
            "repeat": 3
          },
          {
            "status": 202,
            "file": "example2.json"
          },
          {
            "status": 202,
            "file": "example3.json",
            "repeat": 4
          },
          {
            "status": 201,
            "file": "example4.json"
          }
        ]
      }
    ]
  }
```

###### Match Headers

```javascript
"v1/route11": {
  "file": "example1.json",
  "get": [
    {
      "file": "example2.json",
      "headers": { // GET with header key-value pair b:2
        "b": "2"
      }
    },
    {
      "file": "example3.json",
      "headers": { // GET with header key-value pair b:3
        "c": "3"
      }
    }
  ]
}
```

###### Url Redirect

```javascript
"v1/route9": {
  "url": "http://www.google.com"
}
```

If you omit the port, or set it to `0`, Ekko will let the OS assign a random open port.
This allows you to run multiple servers without keeping track of all ports being used. (see Example 2)

## Events

Ekko emits events to allow implementations to handle when specific events occur. Descriptions of the events are listed below.

* `av:start` - Triggered when the Ekko server has been started.
* `av:stop` - Triggered when the Ekko server has been stopped.
* `av:request` - Triggered when a request has been received.
* `av:response` - Triggered when a response file has been found for the requested route.
* `av:fileNotFound` - Triggered when a response file could not be found -- either as a of an undefined route or the route's response file could not be found.
* `av:redirect` - Triggered when a route specifies to redirect instead of responding with the contents of a file.

To add event handlers, register the events before starting the Ekko server.
```javascript

const ekko = new Ekko(configPath);

ekko.on('av:request', req => {
    /* your logic here */
});

ekko.start();
```

## Acknowledgements

- [apimocker](https://github.com/gstroup/apimocker)
- [json-server](https://github.com/typicode/json-server)

## Authors

**Robert McGuinness**
+ [rob.mcguinness@availity.com](rob.mcguinness@availity.com)

**Kasey Powers**
+ [kasey.powers@availity.com](kasey.powers@availity.com)

## Disclaimer

Open source software components distributed or made available in the Availity Materials are licensed to Company under the terms of the applicable open source license agreements, which may be found in text files included in the Availity Materials.


## License
Copyright (c) 2016 Availity, LLC
