/**
 * @ngdoc service
 * @name gcms.components.data.service:business.profile
 *
 * @description
 * Represents an business profile data service.
 *
 *```js
 * function myCtrl($scope, ValidatedCode){
 *   $scope.identityRequests = [];
 *   ValidatedProfile.query().$promise.then(function(result){
 *     $scope.ValidatedProfile = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ValidatedCode', ValidatedCode);

  ValidatedCode.$inject = ['$resource','localeMapper', 'ENVIRONMENT'];
  /**
   * @ngdoc method
   * @name business.profile
   * @methodOf gcms.components.data.service:business.profile
   * @description Constructor for the business profile data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The business profile data service
   */
  function ValidatedCode($resource,localeMapper, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/uniqueProfileCode/:id/:regionId' + ENVIRONMENT.SERVICE_EXT,
     {
        id: '@id',
        regionId: '@regionId',
        locale: function(){ return localeMapper.getCurrentISOCode();}
      },
      {
        get:    { method:'GET', isArray:true },
      }
    );
  }
})();
