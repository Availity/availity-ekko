You define Ekko server configurations in `config.json`.
Each configuration requires a `host`.
Other configuration options are outlined below.
You must have a configuration called `web`.
An example configuration looks like this:

##### Example 1
>
```javascript
servers: {
    web: {
        host: "0.0.0.0",
        port: 9999
    }
}
```

If you omit the port, or set it to 0, Ekko will let the OS assign a random open port. 
This allows you to run multiple servers without keeping track of all ports being used. (As seen in Example 2)

##### Example 2 Dynamic Port (Ekko only)

>
```javascript
servers: {
    web: {
        host: "0.0.0.0",
        //port: 0 will also create dynamic ports
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
        port: 7777, //proxies need defined ports
        proxy: true,
        proxies: 
        [
            {
                context: "/api", // if url context matches the proxy is triggered for this route
                rewrite: {
                    from: "^/api", // (optional) allows url to be rewritten before forwarding request to proxied server
                    to: ""
                }
            }
        ]
    }
}
```

##### Example 4 Multiple Proxies on one server

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
            {   //you can define multiple context's for a proxy server
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

##### Example 5 Multiple Servers with Proxies
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
    test: { //multiple proxy servers are possible
        host: "127.0.0.1",
        port: 7777,
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


##### Example 6
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
                context: "/api",    //the first defined context is used
                rewrite: {
                    from: "^/api",
                    to: ""
                }
            }
        ]
    }, 
    test: {
        host: "127.0.0.1",
        port: 7777,
        proxy: true,
        proxies: 
        [
            {
                context: "/api", //as long as api proxy is true, this will not be triggered
                rewrite: {
                    from: "^/api",
                    to: ""
                }
            }
        ]
    }
}
```

##### Example 7

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
        proxy: false, //by deleting the proxy line, or setting it to false, the server will not use this server
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
    test: {
        host: "127.0.0.1",
        port: 6666,
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
