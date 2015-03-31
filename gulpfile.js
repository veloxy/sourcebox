/**
 * Gulp packages
 */
var gulp     = require('gulp');
var prefix   = require('gulp-autoprefixer');
var plumber  = require('gulp-plumber');
var less     = require('gulp-less');
var uglify   = require('gulp-uglify');
var concat   = require('gulp-concat');
var clean    = require('gulp-clean');
var sequence = require('gulp-sequence');
var rename   = require('gulp-rename');

/**
 * Source files
 */
var src = {
  js: [
    'src/js/bootstrap/collapse.js',
    'src/js/bootstrap/dropdown.js',
  ],
  fonts: [
    'src/fonts/**/*'
  ],
  less: 'src/less/**/*.less',
  html: 'src/**/*.html'
};

/**
 * Destination folders
 */
var dest = {
  css: 'build/css/',
  js: 'build/js/',
  fonts: 'build/fonts/',
  path: 'build'
}

/**
 * Compile less files
 */
gulp.task('less', function() {
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(dest.css))
});

/**
 * Minify and combine scripts
 */
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(dest.js))
});

/**
 * Move fonts to destination directory
 */
gulp.task('fonts', function() {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fonts));
});

/**
 * Move html files to destination directory
 */
gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(gulp.dest(dest.path));
});

/**
 * Clean up destination directy
 */
gulp.task('cleanup', function () {
  return gulp.src(dest.path, {read: false})
    .pipe(clean());
});

/**
 * Build the project
 */
gulp.task('build', function(cb) {
  return sequence('cleanup', 'fonts', 'less', 'js', 'html', cb)
});

/**
 * Watch file changes and build project
 */
gulp.task('default', function () {
  return gulp.watch([src.less, src.js, src.html], ['build']);
});