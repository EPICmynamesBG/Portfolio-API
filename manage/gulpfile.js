var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var prefixer = require('gulp-autoprefixer');
var minifyHTML = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');
var shell = require('gulp-shell');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
};

gulp.task('sass', function () {
  return gulp.src('./src/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .pipe(prefixer())
    .pipe(concat('app.css'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-min', function () {
  return gulp.src('./src/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(prefixer())
    .pipe(concat('app.min.css'))
    .on('error', handleError)
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
  return gulp.src(['./src/**/app.js', './src/**/**/**/*.module.js', './src/**/**/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-min', function () {
  return gulp.src(['./src/**/app.js', './src/**/**/**/*.module.js', './src/**/**/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .on('error', handleError)
    .pipe(uglify({
        mangle: true
      })
      .on('error', handleError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-html-templates', function () {
  return gulp.src(['./src/**/**/**/*.html', '!index.html'])
    .pipe(templateCache('templates.js', {
      module: 'admin.templates',
      standalone: true,
      root: './src'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-html-templates-min', function () {
  return gulp.src(['./src/**/**/**/*.html', '!index.html'])
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templateCache('templates.min.js', {
      module: 'admin.templates',
      standalone: true,
      root: './src'
    }))
    .pipe(uglify({
        mangle: false
      })
      .on('error', handleError))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/**/**/**/*.js', ['js']);
  gulp.watch('./src/**/**/**/**/*.scss', ['sass']);
  gulp.watch(['./src/**/**/**/*.html', '!index.html'], ['build-html-templates']);
});

gulp.task('build-prod', ['sass', 'js', 'sass-min', 'js-min', 'build-html-templates', 'build-html-templates-min']);

gulp.task('docs', shell.task([
  'node_modules/jsdoc/jsdoc.js ' +
    '-c node_modules/angular-jsdoc/common/conf.json ' + // config file
    '-t node_modules/angular-jsdoc/angular-template ' + // template file
    '-d dist/docs ' + // output directory
    './README.md ' + // to include README.md as index contents
    '-r scripts' // source code directory
//    '-u tutorials'                              // tutorials directory
]));

gulp.task('default', ['sass', 'js', 'build-html-templates', 'watch']);