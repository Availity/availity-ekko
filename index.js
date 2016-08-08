'use strict';

const path = require('path');
const Ekko = require('./server');
const _ = require('lodash');

let configPath = path.join(__dirname, 'default-config.js');
const index = _.findIndex(process.argv, (arg) => { return arg === '--config-path' });
if (index > 0) configPath = path.join(__dirname, process.argv[index + 1]);

const ekko = new Ekko(configPath);
ekko
  .start()
  .catch(function() {/* no op */});
