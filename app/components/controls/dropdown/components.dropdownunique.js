/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsDropdown
 * @scope
 * @restrict E
 *
 * @description
 * Provides a dropdown for critical, required, and optional states.
 * Provides a span element for view state.
 *
 * 
 *
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsDropdownunique', Dropdownunique);

    Dropdownunique.$inject = ['state'];

    /**
     * @ngdoc method
     * @name Dropdown
     * @methodOf gcms.components.controls.directive:gcmsDropdown
     * @description Constructor for the Dropdown directive
     * @param {object} state The service responsible for returning a state (critical, required, etc.) based on a attribute name.
     * @returns {object} Dropdown directive
     */
    function Dropdownunique(state) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          id: '@',
          label: '@',
          attributeName: '@',
          list: '@',
          info: '@',
          value: '=model',
          disabled: '@',
          empty: '@'
        },
        templateUrl: 'app/components/controls/dropdown/components.dropdownunique.html',
        controller: function($scope) {
          // scope variables
          $scope.disabled = $scope.disabled ? ($scope.disabled === 'true') : false;
          $scope.empty = $scope.empty ? ($scope.empty === 'true') : true;
          $scope.model = {value: $scope.value };

          $scope.$watch('model.value', function(value) {
            $scope.value = value;
          });

          $scope.$watch('value', function(value){
            $scope.model = { value : value };
          });

          var setState = function(result) {
            $scope.state = result;
          };

          state.get($scope.attributeName).then(setState);

          $scope.$on('$localeChangeSuccess', function() {
            state.get($scope.attributeName).then(setState);
          });
        }
      };
    }
})();
