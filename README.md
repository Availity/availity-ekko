# availity-ekko

> Mock server simulating Availity API rest services

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&label=windows)](http://opensource.org/licenses/MIT)
[![NPM](http://img.shields.io/npm/v/availity-ekko.svg?style=flat-square&label=npm)](https://npmjs.org/package/availity-ekko)
[![Dependency Status](https://img.shields.io/david/Availity/availity-ekko.svg?style=flat-square)](https://david-dm.org/Availity/availity-ekko)
[![Linux Passing](https://img.shields.io/travis/Availity/availity-ekko.svg?style=flat-square&label=linux)](https://travis-ci.org/Availity/availity-ekko)
[![Windows Passing](https://img.shields.io/appveyor/ci/robmcguinness/availity-ekko.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/robmcguinness/availity-ekko)

# Table of Contents
  * [Intro](#intro)
  * [Route Configuration](#route-configuration)
  * [Proxy Configuration](#proxy-configuration)
  * [Authors](#authors)
  * [Disclaimer](#disclaimer)
  * [License](#license)


## Intro
Develop your web application with no dependencies on back end services by running a simple Express http server which can deliver mock responses. 

Responses can be JSON, XML,to simulate REST or SOAP services. Access-Control HTTP Headers are set by default to allow CORS requests. Mock services are configured in the [routes.json](./routes.json) file.

>
This server can return other file types besides XML or JSON (PDFs, images, etc).  The appropriate response headers will be automatically set for different file types.  For a complete list of file types supported view the [mime types here](https://github.com/jshttp/mime-db/blob/88d8b0424d93aefef4ef300dc35ad2c8d1e1f9d4/db.json).


## Route Configuration
The `routes.json` defines the mock responses for rest services. Below are some sample scenarios that should help you understand the configuration options.  

The mock server support deeply nested introspection of JSON POST/PUT requests as well as multi-part from data to provider the proper response.

###### Example 1
>
```javascript
"v1/route1": {
  "file": "example1.json" // response for all GET|PUT|POST|DELETE requests
}
```

###### Example 2
>
```javascript
"v1/route2": {
  "latency": 250, // latency in (ms) 
  "file": "example2.json", // response for all GET|PUT|POST|DELETE requests
  "status": 201 // return status code 201
}
```

###### Example 3

>
```javascript
"v1/route3": {
  "file": "example3.json", // response for GET|PUT|DELETE requests
  "post": "example1.json" // response for POST requests
}
```

###### Example 4

>
```javascript
"v1/route4": {
  "get": "example1.json", // response for all GET requests 
  "put": "example2.json", // response for all PUT requests
  "post": "example3.json", // response for all POST requests
  "delete": "example4.json" // response for all DELETE requests
}
```

###### Example 5 Query Params

>
```javascript
"v1/route5": {
  "file": "example1.json", // response for all POST|PUT|DELETE requests
  "get": [
    {
      "file": "example2.json",
      "status": 200, // default status code is 200
      "params": { // response for GET /v1/router?a=1&b=2&c=3
        "a": "1",
        "b": "2",
        "c": "3"
      }
    },
    {
      "file": "example3.json",
      "params": { // response for GET /v1/router?a=1&a=2&a=3&a=4
        "a": [1, 2, 3, 4] 
      }
    }
  ]
}
```

###### Example 6 POST with Params
>
```javascript
"v1/route6": {
  "file": "example1.json", // response for all GET|PUT|DELETE requests
  "post": [
    {
      "file": "example2.json",
      "params": { // response for POST with JSON payload {"a": 1}
        "a": 1
      }
    },
    {
      "file": "example3.json",
      "params": { // response for POST with JSON payload {a: {b: {c: "1"} } }
        "a.b.c": 1 // config allows for nested attributes
      }
    },
    {
      "file": "example4.json",
      "params": { // response for POST with JSON payload {a : {b: [0,1,2] } }
        "a.b[2]": 2 // config allows for nested array attributes
      }
    }
  ]
},
```

###### Example 7 Multipart

>
```html
<form action="/api/v1/users" method="post" enctype="multipart/form-data">
  <p><input type="text" name="a" value="example">
  <p><input type="file" name="b"> <!--the name of the file is used below to match and score the proper response -->
  <p><button type="submit">Submit</button>
</form>
```

>
```javascript
"v1/route7": {
  "file": "example1.json", // response for all GET|PUT|DELETE requests
  "post": [
    {
      "file": "example2.json" // default response if none match below      
    },
    {
      "file": "example3.json",
      "params": { // response for form submit where form fields a=1 and b="sample.pdf"
        "a": 1,
        "b": "sample.pdf"
      }
    },
    {
      "file": "example4.json",
      "params": { // response for form submit where form fields a=2 and b="another.name.jpg"
        "a": 2,
        "b": "another.name.jpg"
      }
    }
  ]
}
```

###### Example 8 Async

>
```javascript
"v1/route8": {
  "file": "example1.json",
  "get": [
    {
      "file": "example1.json",
      "response": [ 
        {
          // response for first GET request to /v1/route8
          "status": 202,
          "file": "example1.json"
        },
        {
          // response for second GET request to /v1/route8
          "status": 201,
          "file": "example2.json"
        }
      ]
    }
  ]
}
```

####### Example 10 Repeated Async
>
```javascript
"v1/route10": {
    "get": [
      {
        "file": "example1.json",
        "response": [
          {
            "file": "example1.json",
            "repeat": 3
          },
          {
            "status": 201,
            "file": "example2.json"
          },
          {
            "file": "example3.json",
            "repeat": 4
          },
          {
            "file": "example4.json",
            "repeat": 2
          }
        ]
      }
    ]
  }
```

###### Example 9 Url Redirect
>
```javascript
"v1/route9": {
  "url": "http://www.google.com"
}
```


## Proxy Configuration
You define Ekko server configurations in `config.json`.  Each configuration requires a `host`.  Other configuration options are outlined below.  You must have a configuration called `web` that is used to serve static files and the proxy server.  An example configuration looks like this:

###### Example 1
>
```javascript
{
    user: 'johndoe', // globall set `RemoteUser` header across all proxy requests
    servers: {
        web: { // (required) server used for static resources
            host: "0.0.0.0",
            port: 9999
        }
    }
}
```

If you omit the port, or set it to `0`, Ekko will let the OS assign a random open port. 
This allows you to run multiple servers without keeping track of all ports being used. (see Example 2)

###### Example 2 Dynamic Port (Ekko only)

>
```javascript
servers: {
    web: {
        host: "0.0.0.0",
        port: 0 // dynamic port
    }
}
```

###### Example 3 Proxy

>
```javascript
servers: {
    web: {
        host: "127.0.0.1",
        port: 9999
    },
    api: {
        host: "127.0.0.1",
        port: 7777, // port number to proxied server
        proxy: true, // defaults to false.  when true the proxy is enabled
        header: {
            "userid": "johndoe" // set custom header for proxy requests to this server
        },
        proxies: 
        [
            {
                context: "/api", // if url context matches the proxy is triggered for all routes
                rewrite: { // (optional) allows url to be rewritten before forwarding request to a proxied server
                    from: "^/api", // convert /api/v1/ping 
                    to: "" // to /v1/ping
                }
            }
        ]
    }
}
```

###### Example 4 Multiple contexts

>
```javascript
servers: {
    web: {
        host: "127.0.0.1",
        port: 9999
    },
    api: {
        host: "127.0.0.1",
        port: 7777,
        proxy: true,
        proxies: 
        [
            {
                context: "/api",
                rewrite: {
                    from: "^/api",
                    to: ""
                },
                header: {
                    "userid": "johndoe" // set custom header for proxy requests this context for this server
                }
            },
            {   
                context: "/api2", // you can define multiple context's for a proxied server
                rewrite: {
                    from: "^/api2",
                    to: "/v1"
                }
            }
        ]
    }
}
```

###### Example 5 Multiple Proxied Servers
>
```javascript
servers: {
    web: {
        host: "127.0.0.1",
        port: 9999
    },
    api: {
        host: "127.0.0.1",
        port: 7777,
        proxy: true,
        proxies: 
        [
            {
                context: "/api",
                rewrite: {
                    from: "^/api",
                    to: ""
                }
            }
        ]
    }, 
    other: { // define more servers to proxy
        host: "127.0.0.1",
        port: 8888,
        proxy: true,
        proxies: 
        [
            {
                context: "/test",
                rewrite: {
                    from: "^/test",
                    to: ""
                }
            }
        ]
    }
}
```


## Authors

**Robert McGuinness**
+ [rob.mcguinness@availity.com](rob.mcguinness@availity.com)

**Kasey Powers**
+ [kasey.powers@availity.com](kasey.powers@availity.com)



## Disclaimer
Open source software components distributed or made available in the Availity Materials are licensed to Company under the terms of the applicable open source license agreements, which may be found in text files included in the Availity Materials.


## License
Copyright (c) 2015 Availity, LLC