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
var midipy = jsFolder + 'midipy/*.js';

gulp.task('uglify', function() {
	gulp.src([polyGeometries, polyMeshesFold, midipy, jsFolder+'*.js'])
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
