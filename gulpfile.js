// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');
var path = require('path');

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix= new LessPluginAutoPrefix({browsers: ["last 10 versions"]});

var paths = {
    public: {
        css: './public/stylesheets',
        js: './public/javascripts',
        jsfile: 'all.min.js'
    },
    less: './media/less',
    js: './media/js'
};

var externaljs = {
    jquery: 'node_modules/jquery/dist/jquery.min.js',
    bootstrap: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
    jsrender: 'node_modules/jsrender/jsrender.min.js',
    datepicker: 'node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js'
};

// Lint Task
gulp.task('lint', function() {
	// ignoring use of new Parameter for constructors with option 'evil'
	// this option is discouraged
    return gulp.src([paths.js + '/*.js'])
        .pipe(jshint())
        .pipe(jshint({ evil: true }))
        .pipe(jshint.reporter('default'));
});

// Compile Our Less
gulp.task('less', function() {
    return gulp.src(paths.less + '/*.less')
    .pipe(less({
	  plugins: [autoprefix],
      compress: true,
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest(paths.public.css));
});

gulp.task('fs', ['less'], function() {
    return gulp.src(paths.public.css + '/*.css');
});

// Concatenate & Minify JS
gulp.task('compress', function() {
    return gulp.src([
        externaljs.jquery,
        externaljs.bootstrap,
        externaljs.jsrender,
        externaljs.datepicker,
        paths.js + '/*.js'])
        .pipe(concat(paths.public.jsfile))
        .pipe(gulp.dest(paths.public.js))
        .pipe(uglify())
        .pipe(gulp.dest(paths.public.js));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.js + '/*.js', ['lint', 'compress']);
    gulp.watch([paths.less + '/*.less'], ['fs']);
});

// Default Task
gulp.task('default', ['fs', 'lint', 'compress', 'watch'], function() {
    nodemon({
        script: './bin/www',
        ext: 'js html',
        ignore: [
            'public/'
        ]
    });
});
