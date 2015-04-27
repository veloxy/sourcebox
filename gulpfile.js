/**
 * Gulp packages
 */
var gulp      = require('gulp');
var prefix    = require('gulp-autoprefixer');
var plumber   = require('gulp-plumber');
var less      = require('gulp-less');
var uglify    = require('gulp-uglify');
var concat    = require('gulp-concat');
var clean     = require('gulp-clean');
var sequence  = require('gulp-sequence');
var rename    = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

/**
 * Source files
 */
var src = {
  js: [
    'src/js/libs/jquery.min.js',
    'src/js/libs/jquery.scroll.startstop.js',
    'src/js/bootstrap/collapse.js',
    'src/js/bootstrap/dropdown.js',
    // 'src/js/libs/three.control.js',
    'src/js/libs/three.stats.js',
    'src/js/libs/three.min.js',
    'src/js/modules/header.js',
    'src/js/main.js',
  ],
  fonts: [
    'src/fonts/**/*'
  ],
  less: 'src/less/**/*.less',
  html: 'src/**/*.html',
  img: 'src/img/*'
};

/**
 * Destination folders
 */
var dest = {
  css: 'src/themes/sourcebox/source/css/',
  js: 'src/themes/sourcebox/source/js/',
  fonts: 'src/themes/sourcebox/source/fonts/',
  img: 'src/themes/sourcebox/source/img/',
  path: 'src/themes/sourcebox'
};

var bootstrap = {
  js: {
    src: 'node_modules/bootstrap/js/**/*.js',
    dest: 'src/js/bootstrap/'
  },
  less: {
    src: 'node_modules/bootstrap/less/**/*.less',
    dest: 'src/less/bootstrap/'
  }
};

/**
 * Compile less files
 */
gulp.task('less', function() {
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
    .pipe(rename('style.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(dest.css));
});

/**
 * Minify and combine scripts
 */
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest.js));
});

/**
 * Move fonts to destination directory
 */
gulp.task('fonts', function() {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fonts));
});

/**
 * Move fonts to destination directory
 */
gulp.task('copy-bootstrap', function() {
  for (var key in bootstrap) {
    var folder = bootstrap[key];
    gulp.src(folder.src).pipe(gulp.dest(folder.dest));
  }
});

/**
 * Move images to destination directory
 */
gulp.task('images', function() {
  return gulp.src(src.img).pipe(gulp.dest(dest.img));
});


/**
 * Move html files to destination directory
 */
gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(gulp.dest(dest.path));
});

/**
 * Build the project
 */
gulp.task('build', function(cb) {
  return sequence('fonts', 'copy-bootstrap', 'less', 'js', 'images', cb);
});

/**
 * Watch the files and build where needed
 */
gulp.task('watch', function() {
  gulp.watch([src.less], ['less']);
  gulp.watch([src.js], ['js']);
  gulp.watch([src.img], ['images']);
});

/**
 * Watch file changes and build project
 */
gulp.task('default', function(cb) {
  return sequence('build', 'watch', cb);
});