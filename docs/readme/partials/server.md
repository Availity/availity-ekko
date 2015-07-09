The default server configuration can be found in [config.js](./config.js).  Pass a different configuration file to the Ekko server to override the defaults.

```js
var path = require('path');
var Ekko = require('./server');

var configPath = path.join(__dirname, 'path/to/config.js');

var ekko = new Ekko(configPath);
ekko.start();
```

Ekko also supports overriding defaults using command line arguments (useful to setup different configurations in WebStorm).  The CLI commands are equivalent to the `config.js` object using dot notation.  Using example configuration below, run `node index.js --severs.web.port=8888` o override the web server port for `development` mode.

```javascript
{
  development: {
    ...
    servers: {
      web: {
        host: "0.0.0.0",
        port: 9999
      }
    }
    ...
  }
}
```
