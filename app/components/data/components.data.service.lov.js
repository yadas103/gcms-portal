/**
 * @ngdoc service
 * @name gcms.components.data.service:Lov
 *
 * @description
 * Represents a lov data service.
 *
 *```js
 * function myCtrl($scope, Lov){
 *   $scope.specialties = [];
 *   Lov.query({name:'specialty'}).$promise.then(function(result){
 *     $scope.specialties = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Lov', Lov);

  Lov.$inject = ['$resource', 'localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name Lov
   * @methodOf gcms.components.data.service:Lov
   * @description Constructor for the lov data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The lov data service
   */
  function Lov($resource, localeMapper, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/lov/:name' + ENVIRONMENT.SERVICE_EXT,
      {
        name: '@name',
        locale: function(){ return localeMapper.getCurrentISOCode(); },
      },
      {
        query:  { method:'GET', isArray:true }
      }
    );

  }

})();
