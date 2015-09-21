var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

module.exports = {
  args: {
    verbose: !!argv.verbose
  },
  project: {
    path: path.resolve(__dirname, '..')
  },
  packages: {
    src: './package.json'
  },
  js: {
    src: ['gulpfile.js', 'gulp/**/*.js', 'server/**/*.js']
  },
  specs: {
    src: ['server/**/*spec.js']
  }
};
