'use strict';

const path = require('path');
const Ekko = require('./server');
const yargs = require('yargs');

const { argv } = yargs;
const configPath = argv.ekkoConfig || path.join(__dirname, 'config.js');

const ekko = new Ekko(configPath);
ekko
  .start()
  .catch(() => true);
