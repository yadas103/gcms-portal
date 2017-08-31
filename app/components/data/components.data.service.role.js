/**
 * @ngdoc service
 * @name gcms.components.data.service:Role
 *
 * @description
 * Represents a role data service.
 *
 *```js
 * function myCtrl($scope, Role){
 *   $scope.roles = [];
 *   Role.query().$promise.then(function(result){
 *     $scope.roles = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Role', Role);

  Role.$inject = ['$resource', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name Role
   * @methodOf gcms.components.data.service:Role
   * @description Constructor for the role data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The role data service
   */
  function Role($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'role/:id' + ENVIRONMENT.SERVICE_EXT,
      {
        id: '@id'
      },
      {
        update: { method:'PUT' }
      }
    );
  }

})();
