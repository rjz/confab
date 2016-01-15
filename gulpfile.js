'use strict';

var gulp = require('gulp');
var coveralls = require('gulp-coveralls');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var docs = require('./tasks');

var SOURCE_CODE = ['index.js', 'lib/*.js'];
var TEST_CODE = ['test/*.js'];

gulp.task('lint', function() {
  return gulp.src(SOURCE_CODE.concat(TEST_CODE))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('pre-test', function () {
    return gulp.src(SOURCE_CODE)
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['lint'], function () {
    return gulp.src(TEST_CODE)
        .pipe(jasmine());
});

gulp.task('cover', ['lint', 'pre-test'], function () {
    return gulp.src(TEST_CODE)
        .pipe(jasmine())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports());
});

gulp.task('coveralls', function () {
    return gulp.src('coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('docs', function () {
    docs(SOURCE_CODE);
});
