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
 * ```html
 <div ng-switch="state" ng-form="form">
 	<div ng-switch-when="critical">
 		<div class="{{class}}">
 			<div ng-if="label">
 				<label>{{label}}</label>
 				<span class="text-danger">*</span>
 				<span ng-if="info" class="animate-if">
 					<i class="fa fa-info-circle" gcms-popover></i>
 					<div ng-hide="true" class="pop-content">{{info}}</div>
 				</span>
 			</div>
 		  <input id="{{id}}" name="{{id}}" class="form-control" type="{{type}}" ng-model="model.value" required gcms-critical/>
 		</div>
 	</div>
 	<div ng-switch-when="required">
 		<div class="{{class}}">
 			<div ng-if="label">
 				<label>{{label}}</label>
 				<span class="text-danger">*</span>
 				<span ng-if="info" class="animate-if">
 					<i class="fa fa-info-circle" gcms-popover></i>
 					<div ng-hide="true" class="pop-content">{{info}}</div>
 				</span>
 			</div>
 		  <input id="{{id}}" name="{{id}}" class="form-control" type="{{type}}" ng-model="model.value" required />
 		</div>
 	</div>
 	<div ng-switch-when="optional">
 		<div class="{{class}}">
 			<div ng-if="label">
 				<label>{{label}}</label>
 				<span ng-if="info" class="animate-if">
 					<i class="fa fa-info-circle" gcms-popover></i>
 					<div ng-hide="true" class="pop-content">{{info}}</div>
 				</span>
 			</div>
 	  	<input id="{{id}}" name="{{id}}" ng-form="form" class="form-control" type="{{type}}" ng-model="model.value" />
 		</div>
 	</div>
 	<div ng-switch-when="view">
 		<div class="{{class}}">
 			<div ng-if="label">
 				<label>{{label}}</label>
 				<span ng-if="info" class="animate-if">
 					<i class="fa fa-info-circle" gcms-popover></i>
 					<div ng-hide="true" class="pop-content">{{info}}</div>
 				</span>
 			</div>
 	  	<div id="{{id}}" name="{{id}}">{{model.value}}</div>
 		</div>
 	</div>
 </div>
 * ```
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsTextbox', Textbox);

    Textbox.$inject = ['state', 'length'];

    /**
     * @ngdoc method
     * @name Textbox
     * @methodOf gcms.components.controls.directive:gcmsTextbox
     * @description Constructor for the Textbox directive
     * @param {object} state critical/optional/required/view/hide
     * @param {object} length for each attribute
     * @returns {object} Textbox directive
     */
    function Textbox(state, length) {
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
        templateUrl: 'app/components/controls/textbox/components.textbox.html',
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
