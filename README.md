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

Develop web applications without heavy back-end services by running a simple Express http server which can deliver mock responses.

Responses can be JSON or other formats to simulate REST services. Access-Control HTTP Headers are set by default to allow CORS requests. Mock services are configured in the [routes.json](./routes.json) file.

This server can return other file types besides XML or JSON (PDFs, images, etc).  The appropriate response headers will be automatically set for different file types.  For a complete list of file types supported view the [mime types here](https://github.com/jshttp/mime-db/blob/88d8b0424d93aefef4ef300dc35ad2c8d1e1f9d4/db.json).

## Server Configuration

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
}).then(function() {
    // server started
});
```

Ekko also supports overriding defaults using command line arguments (useful to setup different configurations in WebStorm).  The CLI commands are equivalent to the `config.js` object using dot notation and prefixed with `ekko`.  Using example configuration below, run `node index.js --ekko.port=8888` to override the web server port.  One can also pass the entire configuration file through a CLI arguement like `node index.js --ekkoConfig=/path/to/fileconfig-full.js`.

```javascript
{
    ...
    host: "0.0.0.0",
    port: 9999 // --ekko.port=8888
    ...
  }
}
```

## Options

- **latency**: Global delay for all reponses.  The latency can be overridden per route configuration.  Default is `250ms`.
- **limit**: Upload max size.  Default is `50mb`,
- **host**: Server binds and listens for connections on the specified host. Default is `0.0.0.0`.
- **port**: Server binds and listens for connections on the specified port.  Default is `9999`.
- **data**: Path to folder that contains the json mock responses.
- **routes**: Path(s) to configuration file that contains a mapping of the request/response routes.  Multiple paths can be passed in with an array of strings.
- **plugins**: Array of NPM module names that enhance Ekko with addtional data and routes.  @See [availity-mock-data](https://www.npmjs.com/package/availity-ekko).

## Route Configuration

The `routes.json` defines the mock responses for rest services. Below are some sample scenarios that should help you understand the configuration options.

The mock configuration supports deep nested introspection of JSON and multi-part form data when matching routes. See [Example 6](#example-6-post-with-params-with-deep-introspection) below.

###### Example 1

```javascript
"v1/route1": {
  "file": "example1.json" // response for GET|PUT|POST|DELETE
}
```

###### Example 2
```javascript
"v1/route2": {
  "latency": 250, // latency in (ms)
  "file": "example2.json", // all GET|PUT|POST|DELETE requests
  "status": 201 // return status code 201
}
```

###### Example 3

```javascript
"v1/route3": {
  "file": "example3.json", // GET|PUT|DELETE requests
  "post": "example1.json" // POST requests
}
```

###### Example 4

```javascript
"v1/route4": {
  "get": "example1.json", // all GET requests
  "put": "example2.json", // all PUT requests
  "post": "example3.json", // all POST requests
  "delete": "example4.json" // all DELETE requests
}
```

###### Example 5 Query Params

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

###### Example 6 POST Params

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

###### Example 7 Multipart

```html
<form action="/api/v1/users" method="post" enctype="multipart/form-data">
  <p><input type="text" name="a" value="example">
  <p><input type="file" name="b"> <!--the name of the file is used below to match and score the proper response -->
  <p><button type="submit">Submit</button>
</for
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

###### Example 8 Async Responses

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

###### Example 9 Async with repeat option

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

###### Example 10 Header Matching

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

###### Example 11 Url Redirect
```javascript
"v1/route9": {
  "url": "http://www.google.com"
}
```

If you omit the port, or set it to `0`, Ekko will let the OS assign a random open port.
This allows you to run multiple servers without keeping track of all ports being used. (see Example 2)

###### Example 2 Dynamic Port (Ekko only)

```javascript
{
    host: "0.0.0.0",
    port: 0 // dynamic port
}
```

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

## Contributing
1. `git clone https://github.com/Availity/availity-ekko`
1. `git checkout develop`
1. `git pull upstream develop`
1. `git checkout -b feature/branch-name`
1. Create some awesome code or fabulous bug fixes
1. Open a [pull request](https://help.github.com/articles/using-pull-requests/) against the develop branch
1. Wait for a commiter to merge and release

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
