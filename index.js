'use strict';

const path = require('path');
const Ekko = require('./server');

const configPath = path.join(__dirname, 'config.js');

const ekko = new Ekko(configPath);
ekko
  .start()
  .catch(function() {/* no op */});
