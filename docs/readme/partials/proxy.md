You define Ekko server configurations in `config.json`.  Each configuration requires a `host`.  Other configuration options are outlined below.  You must have a configuration called `web` that is used to serve static files and the proxy server.  An example configuration looks like this:

##### Example 1
>
```javascript
{
    user: 'johndoe', // global set `RemoteUser` header across all proxy requests
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
        headers: {
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
                },
                headers: {
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
