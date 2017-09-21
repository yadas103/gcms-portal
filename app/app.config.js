(function () {
  'use strict';

  angular
    .module('gcms')
	.config(['$translateProvider', function ($translateProvider) {
  	  $translateProvider.preferredLanguage('de');
	  }])	
    .config(['$httpProvider', function($httpProvider) {
      //initialize get if not there
      if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
      }

      // Answer edited to include suggestions from comments
      // because previous version of code introduced browser-related errors

      //disable IE ajax request caching
      $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
      // extra
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get.Pragma = 'no-cache';
    }])
    .config(['IdleProvider', 'KeepaliveProvider', function(IdleProvider, KeepaliveProvider) {
      // configure Idle settings
    	IdleProvider.idle(15*60); // in seconds // default is 20 minutes
        IdleProvider.timeout(5); // in seconds
        KeepaliveProvider.interval(10*60); // in seconds
    }])
    .config(function(tmhDynamicLocaleProvider) {
      tmhDynamicLocaleProvider.localeLocationPattern('assets/vendor/angular-i18n/angular-locale_{{locale}}.js');
    })	
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      
	  $stateProvider
      .state('no-permission', {
        resolve: {},
        url: '/no-permission',
        templateUrl: 'app/no-permission.html'
      })	  
      .state('landing', {
          	resolve: {},
              //url: '/',
              //templateUrl: 'app/landing/landing.html',
              url: '/',    
              templateUrl: 'app/recipient/search/recipient.search.html',
              data: {
                section: 'Home',
                action: 'browse'
              }
      })
      .state('profile-results', {
        resolve: {},
        url: '/profile-results/?:criteria',
        templateUrl: 'app/recipient/search/recipient.search.html',
        controller: 'ProfileListCtrl',
        params: {
          criteria: {}
        },
        data: {
          section: 'Home',
          action: 'browse'
        }
      })
      .state('profilereview', {
    	resolve: {},
    	url: '/profilereview',
        templateUrl: 'app/profilereview/identitydetail/identity.html'
      })
      .state('identityProfiles', {
        resolve: {},
        url: '/identityProfiles/?:criteria',
        templateUrl: 'app/profilereview/identitydetail/identity.html',
        controller: 'IdentityListCtrl',
        params: {
          criteria: {}
        }
      })
	  .state('exchange', {
    	resolve: {},
        url: '/exchange',
        controller: 'ExchangeRequestCtrl',
        templateUrl: 'app/identity/identity.html',
        data: {
          section: 'Value Exchange',
          action: 'read'
        }
      })    
      .state('task', {
        resolve: {},
        url: '/task',
        controller: 'TaskCtrl',
        templateUrl: 'app/task/task.html',
        data: {
          section: 'Tasks',
          action: 'browse'
        }
      })
      .state('timeout', {
    	resolve: {},
        url: '/',
        templateUrl: 'app/timeout.html'
      })
       .state('admin', {
    	resolve: {},
    	url: '/admin',
    	controller: 'AdminCtrl',
        templateUrl: 'app/administration/administration.html',
        data: {
          section: 'Administration',
          action: 'browse'
        }
      })
      .state('profile-detail-view', {
			resolve: {},
			url: '/recipient-detail/:id',
			templateUrl: 'app/recipient/search/consentstatus.html',
			controller: 'ConsentAnnexCtrl', 
			data: {
			section: 'Home',
			action: 'browse'
			}
		})
       .state('consent-mgmt', {
              resolve: {},
              url: '/consent-mgmt',       
              controller: 'ConsentMgmtCtrl',
              templateUrl: 'app/consent/consentmgmt.html'
      })
      .state('admin-details', {
        resolve: {},
        url: '/admin/roles/:id',
        controller: 'UserRoleCtrl',
        templateUrl: 'app/administration/administration.details.html',
        data: {
          section: 'Administration',
          action: 'browse'
        }
	  });
    });
})();
