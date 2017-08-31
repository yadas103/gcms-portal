/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsTextbox
 * @scope
 * @restrict E
 *
 * @description
 * Provides a texbox for critical, required, and optional states.
 * Provides a span element for view state.
 *
 *  * ```
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsTextboxunique', Textboxunique);

    Textboxunique.$inject = ['state', 'length'];

    /**
     * @ngdoc method
     * @name Textbox
     * @methodOf gcms.components.controls.directive:gcmsTextbox
     * @description Constructor for the Textbox directive
     * @param {object} state critical/optional/required/view/hide
     * @param {object} length for each attribute
     * @returns {object} Textbox directive
     */
    function Textboxunique(state, length) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          id: '@',
          label: '@',
          attributeName: '@',
          value: '=model',
          form: '=',
          type: '@',
          info: '@',
          disabled: '@'
        },
        templateUrl: 'app/components/controls/textbox/components.textboxunique.html',
        controller: function($scope) {
          // scope variables
          $scope.disabled = $scope.disabled ? ($scope.disabled === 'true') : false;
          $scope.type = $scope.type || 'text';
          $scope.model = {value: $scope.value};
          
          $scope.$watch('model.value', function(value) {
            $scope.value = value;
          });

          $scope.$watch('value', function(value){
            $scope.model = { value : value };
          });

          /**
           * @ngdoc method
           * @name setState
           * @methodOf gcms.components.controls.directive:gcmsTextbox
           * @description Sets the state (critical, hidden, etc.) of the control
           * @param {String} result The state of the control
           */
          var setState = function(result) {
            $scope.state = result;
          };
          
          /**
           * @ngdoc method
           * @name setLength
           * @methodOf gcms.components.controls.directive:gcmsTextbox
           * @description Sets the length for each attribute
           * @param {String} result The state of the control
           */
          var setLength = function(length) {
              $scope.maxLength = length;
          };
            
          length.getLength($scope.attributeName, $scope.type).then(setLength);

          state.get($scope.attributeName).then(setState);

          $scope.$on('$localeChangeSuccess', function() {
            state.get($scope.attributeName).then(setState);
          });

        }
      };
    }

})();
