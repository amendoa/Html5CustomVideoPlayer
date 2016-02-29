"use strict";

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	spritesmith = require('gulp.spritesmith');


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

gulp.task('sprite', function () {
  var spriteData = gulp.src('./assets/images/icons/*.png').pipe(spritesmith({
    imgName: 'player-icons.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('./assets/images'));
});

gulp.task('build', ['compressJS', 'compressCSS']);