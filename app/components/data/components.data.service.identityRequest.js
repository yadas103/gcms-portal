/**
 * @ngdoc service
 * @name gcms.components.data.service:identityRequest
 *
 * @description
 * Represents an user profile data service.
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
   * @description Constructor for the user profile data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The user profile data service
   */
  function IdentityRequestView($resource, localeMapper, ENVIRONMENT)  {

    /*var hydrateidentityRequests = function(response) {
      var collections = $rootScope.session.collections
      var profiles = response.data;

    };
*/
  return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/profileRequest/:id' + ENVIRONMENT.SERVICE_EXT,
      {
    	  
        id: '@id',
        locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {
      get:    { method:'GET', isArray:false },
        query:  { method:'GET', isArray:true },
       update: { method:'PUT' }
      }
    );
  }
})();
