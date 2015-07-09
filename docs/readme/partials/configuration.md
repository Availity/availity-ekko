The `routes.json` defines the mock responses for rest services. Below are some sample scenarios that should help you understand the configuration options.  

The mock server support deeply nested introspection of JSON POST/PUT requests as well as multi-part from data to provider the proper response.

##### Example 1
>
```javascript
"v1/route1": {
  "file": "example1.json" // match for GET|PUT|POST|DELETE 
}
```

##### Example 2
>
```javascript
"v1/route2": {
  "latency": 250, // latency in (ms) 
  "file": "example2.json", // match for all GET|PUT|POST|DELETE requests
  "status": 201 // return status code 201
}
```

##### Example 3

>
```javascript
"v1/route3": {
  "file": "example3.json", // match for GET|PUT|DELETE requests
  "post": "example1.json" // match for POST requests
}
```

##### Example 4

>
```javascript
"v1/route4": {
  "get": "example1.json", // match for all GET requests 
  "put": "example2.json", // match for all PUT requests
  "post": "example3.json", // match for all POST requests
  "delete": "example4.json" // match for all DELETE requests
}
```

##### Example 5 Query Params

>
```javascript
"v1/route5": {
  "file": "example1.json", // match for all POST|PUT|DELETE requests
  "get": [
    {
      "file": "example2.json",
      "status": 200, // default status code is 200
      "params": { // match for GET /v1/router?a=1&b=2&c=3
        "a": "1",
        "b": "2",
        "c": "3"
      }
    },
    {
      "file": "example3.json",
      "params": { // match for GET /v1/router?a=1&a=2&a=3&a=4
        "a": [1, 2, 3, 4] 
      }
    }
  ]
}
```

##### Example 6 POST with Params
>
```javascript
"v1/route6": {
  "file": "example1.json", // match for all GET|PUT|DELETE requests
  "post": [
    {
      "file": "example2.json",
      "params": { // match for POST with JSON payload {"a": 1}
        "a": 1
      }
    },
    {
      "file": "example3.json",
      "params": { // match for POST with JSON payload {a: {b: {c: "1"} } }
        "a.b.c": 1 // config allows for nested attributes
      }
    },
    {
      "file": "example4.json",
      "params": { // match for POST with JSON payload {a : {b: [0,1,2] } }
        "a.b[2]": 2 // config allows for nested array attributes
      }
    }
  ]
},
```

##### Example 7 Multipart

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
  "file": "example1.json", // match for all GET|PUT|DELETE requests
  "post": [
    {
      "file": "example2.json" // default response if none match below      
    },
    {
      "file": "example3.json",
      "params": { // match for form submit where form fields a=1 and b="sample.pdf"
        "a": 1,
        "b": "sample.pdf"
      }
    },
    {
      "file": "example4.json",
      "params": { // match for form submit where form fields a=2 and b="another.name.jpg"
        "a": 2,
        "b": "another.name.jpg"
      }
    }
  ]
}
```

##### Example 8 Async

>
```javascript
"v1/route8": {
  "file": "example1.json",
  "get": [
    {
      "file": "example1.json",
      "response": [ 
        {
          // match for first GET request to /v1/route8
          "status": 202,
          "file": "example1.json"
        },
        {
          // match for second GET request to /v1/route8
          "status": 201,
          "file": "example2.json"
        }
      ]
    }
  ]
}
```

##### Example 10 Async with repeat option
>
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

##### Example 9 Url Redirect
>
```javascript
"v1/route9": {
  "url": "http://www.google.com"
}
```
