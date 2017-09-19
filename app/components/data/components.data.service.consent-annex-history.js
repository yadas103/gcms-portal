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
    .factory('ConsentAnnex', ConsentAnnex);

  ConsentAnnex.$inject = ['$resource', 'localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name ConsentAnnex
   * @methodOf gcms.components.data.service:ConsentAnnex
   * @description Constructor for the ConsentAnnex data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * 
   */
  function ConsentAnnex($resource, localeMapper, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/consent-annex:name' + ENVIRONMENT.SERVICE_EXT,
      {
        name: '@name',
        locale: function(){ return localeMapper.getCurrentISOCode(); },
      },
      { 
    	update: { method:'PUT' },
        query:  { method:'GET', isArray:true },
        save:   { method: 'POST'}
      }
    );

  }

})();
