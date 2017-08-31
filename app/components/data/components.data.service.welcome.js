/**
 * @ngdoc service
 * @name gcms.components.data.service:Welcome
 *
 * @description
 * Represents a welcome data service.
 *
 *```js
 * function myCtrl($scope, Welcome){
 *   $scope.welcome = '';
 *   Welcome.get().$promise.then(function(result){
 *     $scope.welcome = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Welcome', Welcome);

  Welcome.$inject = ['$resource','$log', 'localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name Welcome
   * @methodOf gcms.components.data.service:Welcome
   * @description Constructor for the welcome data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The welcome data service
   */
  function Welcome($resource, localeMapper, ENVIRONMENT) {
	
    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/welcome-message/:id' + ENVIRONMENT.SERVICE_EXT,
      {
        id: '@id',
        locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {
        query:  { method:'GET',  isArray:false },
        update: { method:'PUT' }
      }
    );

  }

})();
