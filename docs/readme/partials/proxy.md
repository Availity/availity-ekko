In `config.json` the ekko server configurations are defined.
 
Ekko runs on the 'web' server, while any others can be set up as proxies with the proxy flag.

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

##### Example 2 Dynamic Port (Ekko only)
By either setting port to 0, or removing the field, Ekko will let the OS assign a random port

>
```javascript
servers: {
    web: {
        host: "0.0.0.0",
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
            {
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
    test: {
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

##### Example 4

Servers with proxy set to false, or undefined, will be ignored by Ekko

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
        proxy: false,
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
