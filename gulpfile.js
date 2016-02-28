"use strict";

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename');

gulp.task('compressJS' , function () {
	return gulp.src('assets/javascript/*.js')
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/assets/javascript'))
});

gulp.task('compressCSS', function () {
	gulp.src('assets/stylesheet/*.css')
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/assets/stylesheet'));
});

gulp.task('default', ['compressJS', 'compressCSS']);