/* jshint node: true */

const
  gulp     = require('gulp')
, stylus   = require('gulp-stylus')
, concat   = require('gulp-concat')
, uglify   = require('gulp-uglify')
, server   = require('gulp-webserver')
, uglicss  = require('gulp-uglifycss')
, annotate = require('gulp-ng-annotate')
, mainBowerFiles = require('main-bower-files')
, cleanCSS = require('gulp-clean-css')
, env = {env: 'dev' };

gulp.task('server', function(){
  gulp.src('./dist')
  .pipe(server({
    livereload : true
  , port       : 9999
}));
});

gulp.task('stylus', function(){
  gulp.src('./src/styles/*.styl')
  .pipe(stylus())
  .pipe(uglicss())
  .pipe(cleanCSS())
  .pipe(concat('css.min.css'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('bowerJs', function(){
  gulp.src(mainBowerFiles('**/*.js', env))
  .pipe(gulp.dest('./dist'));
});

gulp.task('bowerCss', function(){
  gulp.src(mainBowerFiles('**/*.css'))
  .pipe(uglicss())
  .pipe(cleanCSS())
  .pipe(concat('lib.min.css'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('js', function(){
  gulp.src('./src/scripts/*.js')
  .pipe(annotate())
  .pipe(uglify())
  .pipe(concat('js.min.js'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function(){
  gulp.watch('./src/styles/*.styl', ['stylus']);
  gulp.watch('./src/scripts/*.js', ['js']);
  gulp.watch('./dist/*.html');
});

gulp.task('default', ['stylus', 'js', 'server', 'watch', 'bowerJs', 'bowerCss']);
