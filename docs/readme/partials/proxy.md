You define Ekko server configurations in `config.json`.  Each configuration requires a `host`.  Other configuration options are outlined below.  You must have a configuration called `web` that is used to server static files.  An example configuration looks like this:

##### Example 1
>
```javascript
servers: {
    web: { // (required) server used for static resources
        host: "0.0.0.0",
        port: 9999
    }
}
```

If you omit the port, or set it to `0`, Ekko will let the OS assign a random open port. 
This allows you to run multiple servers without keeping track of all ports being used. (@see Example 2)

##### Example 2 Dynamic Port (Ekko only)

>
```javascript
servers: {
    web: {
        host: "0.0.0.0",
        port: 0 // dynamic port
    }
}
```

##### Example 3 Proxy

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
        proxies: 
        [
            {
                context: "/api", // if url context matches the proxy is triggered for all routes
                rewrite: { // (optional) only rewrite urls as needed
                    from: "^/api", // (optional) allows url to be rewritten before forwarding request to a proxied server
                    to: ""
                }
            }
        ]
    }
}
```

##### Example 4 Multiple contexts

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
            },
            {   // you can define multiple context's for a proxy server
                context: "/api2",
                rewrite: {
                    from: "^/api2",
                    to: "/v1"
                }
            }
        ]
    }
}
```

##### Example 5 Multiple Proxied Servers
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
    other: { // multiple proxy servers are possible
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
