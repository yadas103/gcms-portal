/**
 * @ngdoc service
 * @name gcms.components.data.service:UniqueIdVerification
 *
 * @description
 * Represents a UniqueIdVerification data service.
 *
 *```js
 * function myCtrl($scope, UniqueIdVerification){
 *   $scope.UniqueIdVerifications = [];
 *   UniqueIdVerification.query().$promise.then(function(result){
 *     $scope.UniqueIdVerifications = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('UniqueIdVerification', UniqueIdVerification);

  UniqueIdVerification.$inject = ['$resource', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name UniqueIdVerification
   * @methodOf gcms.components.data.service:UniqueIdVerification
   * @description Constructor for the UniqueIdVerification data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The UniqueIdVerification data service
   */
  function UniqueIdVerification($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'unique-identifier-verification/:typeId' + ENVIRONMENT.SERVICE_EXT,
      {
        typeId: '@typeId'
      },
      {
      }
    );
  }

})();
