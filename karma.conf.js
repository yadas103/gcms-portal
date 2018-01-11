// Karma configuration
// Generated on Mon Feb 09 2015 14:51:11 GMT-0500 (Eastern Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 9,
    //browserDisconnectTimeout: 5000,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'bdd-using', 'jasmine-matchers'],

    // list of files / patterns to load in the browser
    files: [
      'assets/vendor/angular/angular.js',
      'assets/vendor/angular-mocks/angular-mocks.js',
      'assets/vendor/angular-bootstrap/ui-bootstrap.js',
      'assets/vendor/angular-ui-select/dist/select.js',
      'assets/vendor/angular-resource/angular-resource.min.js',
      'assets/vendor/angular-file-upload/angular-file-upload.min.js',
      'assets/vendor/angular-sanitize/angular-sanitize.min.js',
      'assets/vendor/ng-csv/build/ng-csv.min.js',
      'app/**/*.module.js',
      'app/**/*.js',
      'app/**/*.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/*.html': ['ng-html2js'],
      'app/**/!(*test).js': ['coverage']
    },


    ngHtml2JsPreprocessor: {
        // stripPrefix: 'app/',
        moduleName: 'templates'
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'story','junit'],

    coverageReporter: {
        reporters : [
            {type: 'html', dir: 'reports/coverage/'},
            {type: 'cobertura', dir: 'reports/coverage/'},
            {type: 'text-summary'},
            // {type: 'json', dir: 'coverage/'}
        ],
    },

    junitReporter : {
      outputFile: 'reports/test-results.xml'
    },
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
