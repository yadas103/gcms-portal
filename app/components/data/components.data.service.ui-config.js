/**
 * @ngdoc service
 * @name gcms.components.data.service:UIConfig
 *
 * @description
 * Represents a UIConfig data service.
 *
 *```js
 * function myCtrl($scope, UIConfig){
 *   $scope.UIConfigs = [];
 *   UIConfig.query().$promise.then(function(result){
 *     $scope.UIConfigs = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('UIConfig', UIConfig);

  UIConfig.$inject = ['$resource', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name UIConfig
   * @methodOf gcms.components.data.service:UIConfig
   * @description Constructor for the UIConfig data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The UIConfig data service
   */
  function UIConfig($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'config-file' + ENVIRONMENT.SERVICE_EXT,
      {
      },
      {
        query: { method:'GET' }
      }
    );
  }

})();
