/* jshint node: true */

const
    gulp = require('gulp')
    , stylus = require('gulp-stylus')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , annotate = require('gulp-ng-annotate')
    , mainBowerFiles = require('main-bower-files')
    , cleanCSS = require('gulp-clean-css')
    , sourcemaps = require('gulp-sourcemaps')
    , postcss = require('gulp-postcss')
    , autoprefixer = require('autoprefixer')
    , mocha = require('gulp-mocha')
    , order = require('gulp-order')
    , rupture = require('rupture')
    , uncss = require('gulp-uncss')
    , browserSync = require('browser-sync').create()
    , reload = browserSync.reload
    , flatten = require('gulp-flatten')
    , processors = [autoprefixer()];

gulp.task('server', function () {
    browserSync.init({
        proxy: 'http://localhost:3001',
        port: 3000
    });
});

gulp.task('stylus', function () {
    return gulp.src('./src/**/*.styl')
        .pipe(flatten())
        .pipe(sourcemaps.init())
        .pipe(stylus({use: rupture()}))
        // .pipe(cleanCSS())
        .pipe(postcss(processors))
        .pipe(concat('css.min.css'))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('bowerCss', function () {
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(postcss(processors))
        .pipe(concat('lib.min.css'))
        .pipe(uncss({html: ['dist/**/*.html']}))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('bowerJs', function () {
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(sourcemaps.init())
        // .pipe(uglify())
        .pipe(concat('lib.min.js'))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js', function () {
    return gulp.src('./src/**/*.js')
        .pipe(flatten())
        .pipe(sourcemaps.init())
        // .pipe(annotate())
        // .pipe(uglify())
        .pipe(order([
            "satellizer.js",
            "app.js",
            "**/*.js"
        ]))
        .pipe(concat('js.min.js'))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function () {
    return gulp.src('./src/**/*.html')
        .pipe(flatten())
        .pipe(gulp.dest('./dist/partials'));
});

//disabled because while developing tests it exits gulp every time a test fails
// so once your tests are all working enable this and add the tests function the default task
// gulp.task('tests', function(){
//     return gulp.src('./server/tests/*.js', {read: false})
//         .pipe(mocha());
// });

gulp.task('watch', function () {
    gulp.watch('./src/**/*.styl', ['stylus']).on("change", reload);
    gulp.watch('./src/**/*.js', ['js']).on("change", reload);
    gulp.watch('./src/**/*.html').on("change", reload);
});

gulp.task('default', ['stylus', 'js', 'bowerJs', 'bowerCss', 'watch', 'server', 'html']);
