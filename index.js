'use strict';

const path = require('path');
const Ekko = require('./server');
const yargs = require('yargs');

const argv = yargs.argv;
const configPath = path.join(__dirname, 'config.js') || argv.ekkoConfig;

const ekko = new Ekko(configPath);
ekko
  .start()
  .catch(function() {/* no op */});
