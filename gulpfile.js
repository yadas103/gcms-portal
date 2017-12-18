'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var checkstyleReporter = require('gulp-jshint-checkstyle-reporter');
var gulpDocs = require('gulp-ngdocs');
var del = require('del');
var mkdirp = require('mkdirp');
var plato = require('plato');
var protractor = require('gulp-protractor').protractor;
var jar = require('selenium-server-standalone-jar');
var chromedriver = require('chromedriver');
var connect = require('gulp-connect');
//var phantomjs = require('phantomjs');
var install = require('gulp-install');
var opn       = require('opn');
var war = require('gulp-war');
var zip = require('gulp-zip');
var gulpNgConfig = require('gulp-ng-config');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

var templateCache = require('gulp-angular-templatecache');

gulp.task('usemin', ['move-templates','move-meta','move-config', 'move-email', 'move-assets','move-famfamfam', 'move-fonts','install', 'build','templates'], function () {
  return gulp.src('./*.html')
      .pipe(usemin({
        css: [minifyCss(), 'concat', rev()],
        html: [minifyHtml({empty: true})],
        js: [/*uglify(), */rev()]
      }))
      .pipe(gulp.dest('build/'));
});

gulp.task('templates', function () {
    gulp.src('./app/**/*.html')
        .pipe(templateCache('templates.js',{module:'gcms', root:'app/'}))
        .pipe(gulp.dest('./'));
});

gulp.task('move-templates', ['clean:build'], function(){
  return gulp.src(['./app/**/*.*'],  {base: './app/'})
  .pipe(minifyHtml({empty: true}))
  .pipe(gulp.dest('./build/app/'));
});

gulp.task('move-meta', ['clean:build'], function(){
	  return gulp.src(['./META-INF/*.*'],  {base: './META-INF/'})	 
	  .pipe(gulp.dest('./build/META-INF/'));
	});

gulp.task('move-config', ['clean:build'], function(){
	  return gulp.src(['./config.*'],  {base: './'})	 
	  .pipe(gulp.dest('./build/'));
	});

gulp.task('move-email', ['clean:build'], function(){
	  return gulp.src(['./emailproperties.*'],  {base: './'})	 
	  .pipe(gulp.dest('./build/'));
	});
	
gulp.task('move-assets', ['clean:build'], function(){
  return gulp.src(['./assets/**/*.ico',
                   './assets/**/*.png',
                   './assets/vendor/**/*.js'],  {base: './assets/'})
  .pipe(gulp.dest('./build/assets/'));
});
gulp.task('move-famfamfam', ['clean:build'], function(){
  return gulp.src(['./assets/vendor/famfamfam/famfamfam-flags.png'])
  .pipe(gulp.dest('./build/css/'));
});

gulp.task('move-fonts', ['clean:build'], function(){
  return gulp.src(['./assets/vendor/fontawesome/fonts/*.*'])
  .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('default', ['connect:reload', 'watch','openbrowser']);
gulp.task('build', ['lint','plato']);
gulp.task('deploy', ['war']);
//Uf2bme2cds!
/**
 *  Run NPM Install and Bower Install
 */
gulp.task('install', function(){
  return gulp.src(['./bower.json', './package.json'])
  .pipe(install());
});


gulp.task('configure:local', function(){
 gulp.src('config.json')
  .pipe(gulpNgConfig('gcms.environment', {
    environment: 'local'
  }))
  .pipe(gulp.dest('.'));
});

gulp.task('configure:local-server', function(){
   gulp.src('config.json')
  .pipe(gulpNgConfig('gcms.environment', {
    environment: 'local-server'
  }))
  .pipe(gulp.dest('.'));
});



gulp.task('configure:test-server', function(){
   gulp.src('config.json')
  .pipe(gulpNgConfig('gcms.environment', {
    environment: 'test-server'
  }))
  .pipe(gulp.dest('.'));
});


gulp.task('war', ['install','build','usemin'],function () {
    return gulp.src(['./build/**/*.*']) 
        //.pipe(warmanifest({
           // options
         //}))
         .pipe(war({
            welcome: 'index.html',
            displayName: 'gcms'            
        }))
       .pipe(zip('gcms-portal.war'))
        .pipe(gulp.dest('./dist/'));

});

/**
 *  Start Web Server
 */
gulp.task('connect', ['install'], function() {
  connect.server();
});

/**
 *  Start Web Server with live reload
 */
gulp.task('connect:reload', ['install'], function() {
  connect.server({
    root: './',
    port: 8000,
    livereload: true
  });
});

gulp.task('change', function () {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*'], ['change','templates']);
});

gulp.task('openbrowser', ['connect:reload'], function() {
  opn( 'http://localhost:8000/','chrome');
});

/**
 * Run test once and exit
 */
gulp.task('test', ['prepare:reports'], function (done) {
  karma.start( {
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(exitStatus) {
  	done(exitStatus ? 'There are failing unit tests' : undefined);
  });
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', ['prepare:reports'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function(exitStatus) {
  	done(exitStatus ? 'There are failing unit tests' : undefined);
  });
});

gulp.task('ngdoc', ['prepare:documentation'], function () {
  var options = {
    styles: ['assets/css/doc.css']
  };

  return gulp.src('app/**/*.js')
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest('./documentation'));
});

gulp.task('lint', ['prepare:reports'], function() {
  return gulp.src('app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(checkstyleReporter())
    .pipe(gulp.dest('reports'));
});

gulp.task('plato', ['prepare:reports'], function () {
  var files = ['app/**/*.js'];

  var outputDir = './reports/plato';
  var options = {
    title: 'GCMS Client',
    jshint: false
  };

  var callback = function (){
  // once done the analysis,
  // execute this
  };

  plato.inspect(files, outputDir, options, callback);
});

gulp.task('accept', ['prepare:reports'], function () {
  connect.server({
    port: 8888
  });

  gulp.src([])
    .pipe(
      protractor({
        configFile: 'specs/protractor.conf.js',
        args: ['--baseUrl', 'http://localhost:8888',
               '--seleniumServerJar', jar.path,
               '--chromeDriver', chromedriver.path,
               '--capabilities.browserName', 'chrome',

               ],
       // debug: true
    }))
    .on('error', function(e) {
      console.log(e);
      throw e;
    })
    .on('end', function() {
       connect.serverClose();
    });

});
gulp.task('accept:dev', ['prepare:reports'], function () {
  connect.server({
    port: 8888
  });

  gulp.src([])
    .pipe(
      protractor({
        configFile: 'specs/protractor.conf.js',
        args: ['--baseUrl', 'http://localhost:8888',
               '--seleniumServerJar', jar.path,
               '--chromeDriver', chromedriver.path,
               '--capabilities.browserName', 'chrome',
               '--cucumberOpts.tags','@dev'

               ],
       // debug: true
    }))
    .on('error', function(e) { throw e; })
    .on('end', function() {
       connect.serverClose();
    });

});

gulp.task('accept:phantom', ['prepare:reports'], function () {
  connect.server({
    port: 8888
  });

  gulp.src(['specs/*.feature'])
    .pipe(protractor({
        configFile: 'specs/protractor.phantom.conf.js',
        args: ['--baseUrl', 'http://127.0.0.1:8888',
               '--seleniumServerJar', jar.path,
               // '--capabilities.phantomjs.binary.path', phantomjs.path,
               // '--capabilities.browserName', 'phantomjs'
               //'--resultJsonOutputFile', 'reports/cucumber.json'
               ]
    }))
    .on('error', function(e) { throw e; })
    .on('end', function() {
       connect.serverClose();
    });

});

gulp.task('clean:documentation', ['install'], function (cb) {
  del([
    'documentation/'
  ], cb);
});
gulp.task('clean:build', [], function (cb) {
  del([
    'build/'
  ], cb);
});
gulp.task('clean:reports', function (cb) {
  del([
    'reports/*[!plato]'
  ], cb);
});

gulp.task('prepare:reports', ['clean:reports'], function() {
  mkdirp('./reports', function (err) {
    if (err) {
      console.error(err);
    }
    else {
      //console.log('Reports Directory Created');
    }
  });
});


gulp.task('prepare:documentation', ['clean:documentation'], function() {
  mkdirp('./documentation', function (err) {
    if (err) {
      console.error(err);
    }
    else {
      //console.log('Documentation Directory Created');
    }
  });
});
