/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsTextarea
 * @scope
 * @restrict E
 *
 * @description
 * Provides a texarea for critical, required, and optional states.
 * Provides a span element for view state.
 *
 * ```html
 <div ng-switch="state">
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
       <textarea class="form-control" rows="rows" model="model.value" style="resize:none" required />
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
       <textarea class="form-control" rows="rows" ng-model="model.value" style="resize:none"/>
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
       <span>{{model.value}}</span>
     </div>
   </div>
 </div>
 * ```
 * @param {closure=} sectionType HCP/HCO/etc
 * @param {closure=} sectionName covered-recipient/Value-exchange/etc
 * @param {closure=} subSectionName Payment Details/general/address/consent/uniqueId/etc
 * @param {closure=} attributeName Notes/etc
 * @param {closure=} model ng-model
 * @param {closure=} state critical/optional/etc
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsTextarea', Textarea);

    Textarea.$inject = ['state', 'length'];

    /**
     * @ngdoc method
     * @name Textarea
     * @methodOf gcms.components.controls.directive:gcmsTextarea
     * @description Constructor for the Textarea directive
     * @param {object} state critical/optional/required/view/hide
     * @returns {object} Textarea directive
     */
    function Textarea(state, length) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          rows:'=',
            attributeName: '@',
          label: '@',
          info: '@',
          value: '=model'
      },
        templateUrl: 'app/components/controls/textarea/components.textarea.html',
        controller: function($scope) {

          $scope.model = {value: $scope.value};
          $scope.$watch('model.value', function(value) {
            $scope.value = value;
          });

          $scope.$watch('value', function(value){
            $scope.model = { value : value };
          });

          var setState = function(result) {
            $scope.state = result;
          };
          /**
           * @ngdoc method
           * @name setLength
           * @methodOf gcms.components.controls.directive:gcmsTextarea
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
