/**
 * @ngdoc service
 * @name gcms.components.data.service:UserDetail
 *
 * @description
 * Represents an user detail data service.
 *
 *```js
 * function myCtrl($scope, UserDetail){
 *   $scope.userDetails = [];
 *   UserDetail.query().$promise.then(function(result){
 *     $scope.userDetails = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('UserDetail', UserDetail);

  UserDetail.$inject = ['$resource', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name UserDetail
   * @methodOf gcms.components.data.service:UserDetail
   * @description Constructor for the user detail data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The user detail data service

   */
  function UserDetail($resource, ENVIRONMENT) {



    return $resource(
      ENVIRONMENT.SERVICE_URI + 'user-detail/:userName' + ENVIRONMENT.SERVICE_EXT,
      {
        userName: '@userName'
      },
      {
        update: { method:'PUT' }/*,*/
      }
    );
  }
})();
