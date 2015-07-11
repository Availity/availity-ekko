var path = require('path');
var Ekko = require('./server');

var configPath = path.join(__dirname, 'config.js');

var ekko = new Ekko(configPath);
ekko
  .start()
  .catch(function() {
    // no op
  });
