/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsCheckbox
 * @scope
 * @restrict E
 *
 * @description
 * Provides a Checkbox for critical, required, and optional states.
 * Provides a span element for view state.
 *
 * ```html
 * <span ng-switch="state">
 *  <input type="checkbox" ng-model="model" required ng-switch-when="critical"/>
 *  <input type="checkbox" ng-model="model" required ng-switch-when="required" />
 *  <input type="checkbox" ng-model="model" ng-switch-when="optional" />
 *  <span ng-switch-when="view">{{model.value}}</span>
 * </span>
 * ```
 * @param {closure=} sectionName covered-recipient/Value-exchange/etc
 * @param {closure=} attributeName Notes/etc
 * @param {closure=} model ng-model
 * @param {closure=} state critical/optional/etc
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsCheckbox', Checkbox);

    Checkbox.$inject = ['state'];

    /**
     * @ngdoc method
     * @name Checkbox
     * @methodOf gcms.components.controls.directive:gcmsCheckbox
     * @description Constructor for the Checkbox directive
     * @param {object} state critical/optional/required/view/hide
     * @returns {object} Checkbox directive
     */
    function Checkbox(state) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
            attributeName: '@',
          model: '=',
          state: '@'
      },
      templateUrl: 'app/components/controls/checkbox/components.checkbox.html',
      controller: function($scope) {

        $scope.model = {value: $scope.value};
        $scope.$watch('model.value', function() {
          $scope.value = $scope.model.value;
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
