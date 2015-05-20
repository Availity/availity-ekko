var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var config = require('../config');

gulp.task('test', ['coverage']);
gulp.task('coverage', ['lint', 'coverage:js']);

gulp.task('coverage:js', function(done) {

  process.env.NODE_ENV = 'testing';

  gulp.src(config.js.src)
    .pipe(istanbul()) // instrument the source files
    .pipe(istanbul.hookRequire()) // always use this option if you're running tests in Node.js
    .on('finish', function () {
      gulp.src(config.specs.src, { read: false })
        .pipe(mocha({
          globals: ['describe', 'before', 'after']
        }))
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
});

gulp.task('test:js', function() {

  process.env.NODE_ENV = 'testing';

  return gulp.src(config.specs.src, { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: ['describe', 'before', 'after']
    }));
});
