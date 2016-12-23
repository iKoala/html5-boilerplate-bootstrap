'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const size = require('gulp-size');
const tap = require('gulp-tap');
const buffer = require('gulp-buffer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const del = require('del');
const browserify = require('browserify');

const PATHS = {
	SRC: './src/vendor/',
	DEST: './dist/vendor/'
};

/**
 * Create stream bundle with path
 * @param  {string} path e.g. "./src/js/*.js"
 * @return {stream} stream gulp stream
 */
var createBundle = function(path) {
	return gulp.src(path, {read: false}) // no need of reading file because browserify does.

		// transform file objects using gulp-tap plugin
		.pipe(tap(function (file) {

			// gutil.log('bundling ' + file.path);
			console.log('bundling ' + file.path);

			// replace file contents with browserify's bundle stream
			file.contents = browserify(file.path, {debug: true}).bundle();

		}))

		// transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
		.pipe(buffer())

		// load and init sourcemaps
		.pipe(sourcemaps.init({loadMaps: true}))

		// minify
		.pipe(uglify())

		// print file size
		.pipe(size())

		// rename to *.min.js
		.pipe(rename({
			suffix: '.min'
		}))

		// write sourcemaps
		.pipe(sourcemaps.write('./'))

		.pipe(gulp.dest(PATHS.DEST));
};

/**
 * Watch js file changes and build
 */
// gulp.task('watch', function() {
// 	// gulp.watch(PATHS.SRC + '**/*.js', ['clean', 'build']);
// 	gulp.watch(PATHS.SRC + '**/*.js', ['clean', 'build']);
// });

/**
 * Clean the dist folder
 */
gulp.task('clean', function() {
	// You can use multiple globbing patterns as you would with `gulp.src`
	return del.sync([
		PATHS.DEST + '**/*.js',
		PATHS.DEST + '**/*.map',
		// '!' + PATHS.DEST + 'aframe*.js'
	]);
});

/**
 * Build and minify js files
 */
gulp.task('build', function () {
	return createBundle(PATHS.SRC + '/**/*.js');
});

// gulp.task('build', function() {
// 	var path = PATHS.SRC + '/vendor.js';
// 	return createBundle(path);
// });

gulp.task('default', ['clean', 'build'], function() {
	//
});
