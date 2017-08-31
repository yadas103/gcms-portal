/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsDatepicker
 * @scope
 * @restrict E
 *
 * @description
 * Provides a Datepicker for critical, required, and optional states.
 * Provides a span element for view state.
 *
 *```html
 *<div ng-switch="state">
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
       <div>
         <input type="date" id="{{id}}" name="{{id}}" class="form-control" ng-model="model.value" required gcms-critical/>
       </div>
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
       <div>
         <input type="date" id="{{id}}" name="{{id}}" class="form-control" ng-model="model.value" required/>
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
       <div>
         <input type="date" id="{{id}}" name="{{id}}" class="form-control" ng-model="model.value"/>
       </div>
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
     	<div id="id">{{model.value | date:'shortDate'}}</div>
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
    .directive('gcmsDatepicker', Datepicker);

    Datepicker.$inject = ['state','$filter'];

    /**
     * @ngdoc method
     * @name Datepicker
     * @methodOf gcms.components.controls.directive:gcmsDatepicker
     * @description Constructor for the Datepicker directive
     * @param {object} state critical/optional/required/view/hide
     * @returns {object} Datepicker directive
     */
    function Datepicker(state, $filter) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          id: '@',
          info: '@',
          label: '@',
          attributeName: '@',
          value: '=model',
          max:'=?',
          min:'=?',
          form:'='
      },

      templateUrl: 'app/components/controls/datepicker/components.datepicker.html',
      controller: function($scope) {

        $scope.max = $scope.max  || new Date('3000-01-01');
        $scope.min = $scope.min  || new Date('2000-01-01');
        $scope.model = {value: new Date() };

        if ($scope.value){
          $scope.model = {value: new Date($scope.value.toString().replace('-','/')) };
        }

        $scope.$watch('model.value', function(value) {
          if (!value){ return; }
          $scope.value = $filter('date')(value, 'yyyy-MM-dd');
        });

        $scope.$watch('value', function(value){
          if (!value){ return; }
          $scope.model = {value: new Date(value.toString().replace('-','/')) }; //hack to force local time vs UTC time
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
