// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function () {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function () {
    return sass('./src/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('./dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src('./src/js/*.js')
        .pipe(concat('jquery.imageviewer.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename('jquery.imageviewer.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function () {

    gulp.start('lint', 'sass', 'scripts');

    gulp.watch('./src/js/*.js', ['lint', 'scripts']);
    gulp.watch('./src/sass/*.scss', ['sass']);
});

// Default Task
gulp.task('default', function() {
    gulp.start('lint', 'sass', 'scripts');
});