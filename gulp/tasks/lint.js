var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', ['lint:js']);

gulp.task('lint:js', function() {

  var config = require('../config');

  gulp.src(config.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
