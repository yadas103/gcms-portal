/**
 * @ngdoc service
 * @name gcms.components.permission.service:permission
 *
 * @description
 * Represents a permission service.
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.permission')
    .factory('permission', permission);

  permission.$inject = ['$rootScope'];

  /**
   * @ngdoc method
   * @name permission
   * @methodOf gcms.components.permission.service:permission
   * @description Constructor for permission service
   * @param {object} $rootScope An execution context providing separation between the model and the view
   * @returns {object} The permission service get method
   */
  function permission($rootScope) {

    /**
     * @ngdoc method
     * @name get
     * @methodOf gcms.components.permission.service:permission
     * @description
     * Gets the permission granted to a the user based on a section and action
     * @param {string} sectionName The section of the system ('Landing', 'Covered Recipient', 'Value-Exchange', 'Administration')
     * @param {string} actionName The action to be taken (create, read, update, delete)
     * @returns {boolean} A promise resolving to a boolean
     */
    function get(sectionName, actionName) {
      var user = $rootScope.session.user;

      return user.getPermissions().then(function(permissions) {
        var result = false;
        angular.forEach(permissions, function(permission) {
          if (permission.entityTypeName.toUpperCase() === sectionName.toUpperCase() && permission.roleActionName.toUpperCase() === actionName.toUpperCase()) {
            result = true;
            return;
          }
        });

        return result;
      });
    }

    return {
      get: get
    };

  }

})();
