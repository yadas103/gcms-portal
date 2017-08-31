/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsRadiobuttons
 * @scope
 * @restrict E
 *
 * @description
 * Provides a texbox for critical, required, and optional states.
 * Provides a span element for view state.
 *
 * ```html
 <div ng-switch="state">
    <div ng-switch-when="required">
     <div class="{{class}}">
       <div ng-if="label">
         <label>{{label}}</label>
         <span ng-if="info" class="animate-if">
           <i class="fa fa-info-circle" gcms-popover></i>
           <div ng-hide="true" class="pop-content">{{info}}</div>
         </span>
       </div>
       <div ng-repeat="item in items">
         <input name="{{name}}" type="radio" ng-model="model.value" ng-value="item.id" required />
         {{item.name}}
       </div>
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
       <div ng-repeat="item in items">
         <input name="{{name}}" type="radio" ng-model="model.value" ng-value="item.id" />
         {{item.name}}
       </div>
     </div>
   </div>
    <div ng-switch-when="view">
     <div class="{{class}}">
       <div ng-if="label">
         <label>{{label}}</label>
         <span class="text-danger">*</span>
         <span ng-if="info" class="animate-if">
           <i class="fa fa-info-circle" gcms-popover></i>
           <div ng-hide="true" class="pop-content">{{info}}</div>
         </span>
       </div>
       <span>{{model.value.name}}</span>
     </div>
   </div>
  </div>
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
    .directive('gcmsRadiobuttons', Radiobuttons);

    Radiobuttons.$inject = ['state', '$rootScope'];

    /**
     * @ngdoc method
     * @name Radiobuttons
     * @methodOf gcms.components.controls.directive:gcmsRadiobuttons
     * @description Constructor for the Radiobuttons directive
     * @param {object} state critical/optional/required/view/hide
     * @param {object} $rootScope Root scope
     * @returns {object} Radiobuttons directive
     */
    function Radiobuttons(state, $rootScope) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          attributeName: '@',
          label: '@',
          info: '@',
          list: '@',
          id:'@',
          value: '=model'
        },
        templateUrl: 'app/components/controls/radiobuttons/components.radiobuttons.html',
        controller: function($scope) {

          $rootScope.session.collections[$scope.list]().then(function(items){
            $scope.items = items;
          });

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
