var gulp = require('gulp');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var reload = browserSync.reload;

//js folders and file paths
var jsFolder = './www/js/';
var polyFolder =  jsFolder + 'jsPolyhedrons/'
var polyGeometries = polyFolder + 'PolyGeometry/*';
var polyMeshesFold = polyFolder + 'PolyMeshes/*';
var midipy = jsFolder + 'midipy/js/*';
//var materials = polyMeshesFold + 'Materials.js';
//var lights = polyMeshesFold + 'makeLights.js'
//var transparency = polyFolder + 'Transparency/makeTransparent.js';
//var verticesSpheres = polyFolder + 'VerticesSpheres/makePolySphere.js';

var chord = jsFolder + 'chord.js';
var render = jsFolder + 'render2.js';
var wnumb = jsFolder + 'wNumb.js';
var slider = jsFolder + 'nouislider.min.js';
var timeline = jsFolder + 'timeline.js';

gulp.task('uglify', function() {
	gulp.src([polyGeometries, polyMeshesFold, chord, render, midipy, timeline, slider, wnumb])
        .pipe(sourcemaps.init())
	       .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
	    .pipe(gulp.dest('./www/js/min'))
});

gulp.task('default', ['uglify'], function() {
	browserSync.init({
        port: 3003,
        server: {
            baseDir: "./www"
        }
    });

	gulp.watch(['www/*.html', 'js/**/*.js'], {cwd: 'www'}, ['uglify',reload]);
});
