/**
 * Gulp packages
 */
var gulp      = require('gulp');
var prefix    = require('gulp-autoprefixer');
var plumber   = require('gulp-plumber');
var less      = require('gulp-less');
var uglify    = require('gulp-uglify');
var concat    = require('gulp-concat');
var sequence  = require('gulp-sequence');
var rename    = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var coffee    = require('gulp-coffee');
var gulpif    = require('gulp-if');
var jade      = require('gulp-jade');
var webserver = require('gulp-webserver');
var zip       = require('gulp-zip');
var uncss     = require('gulp-uncss');

/**
 * Source files
 */
var src = {
  js: [
    'src/js/libs/jquery.min.js',
    'src/js/libs/jquery.scroll.startstop.js',
    'src/js/bootstrap/collapse.js',
    'src/js/bootstrap/dropdown.js',
    'src/js/libs/prism.js',
    'src/js/libs/three.min.js',
    'src/js/coffee/**/*.coffee'
  ],
  fonts: [
    'src/fonts/**/*'
  ],
  less: 'src/less/**/*.less',
  html: 'src/views/**/*.jade',
  img: 'src/img/*'
};

/**
 * Destination folders
 */
var dest = {
  css: 'dist/css/',
  js: 'dist/js/',
  fonts: 'dist/fonts/',
  img: 'dist/img/',
  path: 'dist'
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
gulp.task('less', ['html'], function() {
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
    .pipe(rename('style.min.css'))
    .pipe(uncss({
      html: ['dist/**/*.html'],
      ignore: [/\w\.in/,
        ".fade",
        ".collapse",
        ".collapsing",
        /(#|\.)navbar(\-[a-zA-Z]+)?/,
        /(#|\.)dropdown(\-[a-zA-Z]+)?/,
        /(#|\.)(open)/,
        ".modal",
        ".modal.fade.in",
        ".modal-dialog",
        ".modal-document",
        ".modal-scrollbar-measure",
        ".modal-backdrop.fade",
        ".modal-backdrop.in",
        ".modal.fade.modal-dialog",
        ".modal.in.modal-dialog",
        ".modal-open",
        ".in",
        ".modal-backdrop",
        /(.*)canvas(.*)/
      ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(dest.css));
});

/**
 * Minify and combine scripts
 */
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true})))
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
  return gulp.src(['src/views/**/*.jade', '!src/views/elements{,/**}'])
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('dist'));
});

/**
 * Build the project
 */
gulp.task('build', function(cb) {
  return sequence('fonts', 'copy-bootstrap', 'less', 'js', 'images', 'html', cb);
});

/**
 * Watch the files and build where needed
 */
gulp.task('watch', function() {
  gulp.watch([src.less], ['less']);
  gulp.watch([src.js], ['js']);
  gulp.watch([src.img], ['images']);
  gulp.watch(['src/views/**/*.jade'], ['html']);
});

/**
 * Serve the page
 */
gulp.task('serve', function() {
  gulp.src('dist')
    .pipe(webserver({
      host: 'localhost',
      livereload: true
    }));
});

gulp.task('release', ['build'], function () {
  return gulp.src('dist/**/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('./'));
});

/**
 * Watch file changes and build project
 */
gulp.task('default', function(cb) {
  return sequence('build', 'watch', 'serve', cb);
});
