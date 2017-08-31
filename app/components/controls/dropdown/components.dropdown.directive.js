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
 * ```html
 <div ng-switch="state">

 <div ng-switch-when="critical">
     <div class="{{class}}">
       <div ng-if="label">
         <label>{{label}} <span class="text-danger">*</span></label>
         <span ng-if="info" class="animate-if">
           <i class="fa fa-info-circle" gcms-popover></i>
           <div ng-hide="true" class="pop-content">{{info}}</div>
         </span>
       </div>
       <gcms-lov id="{{id}}" list="{{list}}" value="model.value" form="form" state="state" disabled="{{disabled}}" empty="{{empty}}"></gcms-lov>
     </div>
   </div>

   <div ng-switch-when="required">
     <div class="{{class}}">
       <div ng-if="label">
         <label>{{label}} <span class="text-danger">*</span></label>
         <span ng-if="info" class="animate-if">
           <i class="fa fa-info-circle" gcms-popover></i>
           <div ng-hide="true" class="pop-content">{{info}}</div>
         </span>
       </div>
       <gcms-lov id="{{id}}" list="{{list}}" value="model.value" form="form" state="state" disabled="{{disabled}}" empty="{{empty}}"></gcms-lov>
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
       <gcms-lov id="{{id}}" list="{{list}}" value="model.value" form="form" state="state" disabled="{{disabled}}" empty="{{empty}}"></gcms-lov>
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
       <div id="{{id}}"><gcms-idname id="value" list="{{list}}"></gcms-idname></div>
     </div>
   </div>

 </div>
 * ```
 *
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsDropdown', Dropdown);

    Dropdown.$inject = ['state'];

    /**
     * @ngdoc method
     * @name Dropdown
     * @methodOf gcms.components.controls.directive:gcmsDropdown
     * @description Constructor for the Dropdown directive
     * @param {object} state The service responsible for returning a state (critical, required, etc.) based on a attribute name.
     * @returns {object} Dropdown directive
     */
    function Dropdown(state) {
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
          countrydisabled: '@',
          empty: '@'
        },
        templateUrl: 'app/components/controls/dropdown/components.dropdown.html',
        controller: function($scope) {
          // scope variables
          $scope.countrydisabled = $scope.countrydisabled ? ($scope.countrydisabled === 'true') : false;
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
