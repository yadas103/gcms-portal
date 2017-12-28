/**
 * @ngdoc service
 * @name gcms.components.data.service:identityRequest
 *
 * @description
 * Represents an identityRequest data service.
 *
 *```js
 * function myCtrl($scope, identityRequest){
 *   $scope.identityRequests = [];
 *   identityRequest.query().$promise.then(function(result){
 *     $scope.identityRequests = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('IdentityRequestView', IdentityRequestView);

  IdentityRequestView.$inject = ['$resource', 'localeMapper', 'ENVIRONMENT'];
  /**
   * @ngdoc method
   * @name identityRequest
   * @methodOf gcms.components.data.service:identityRequest
   * @description Constructor for the ProfileRequest data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The ProfileRequest data service
   */
  function IdentityRequestView($resource, localeMapper, ENVIRONMENT)  {

  return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/profileRequest/:id/:status' + ENVIRONMENT.SERVICE_EXT,
      {
    	  
        id: '@id',
          status: '@status',
        locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {
      get:    { method:'GET', isArray:true },
        query:  { method:'GET', isArray:true },
       update: { method:'PUT' }
      }
    );
  }
})();
