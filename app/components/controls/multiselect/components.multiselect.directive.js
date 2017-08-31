/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsMultiselect
 * @scope
 * @restrict E
 *
 * @description
 * Provides a multi select dropdown for critical, required, and optional states.
 * Provides a span element for view state.
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
       <ui-select id="{{id}}" name="{{id}}" multiple ng-model="model.value" required gcms-critical>
         <ui-select-match placeholder="Pick one...">{{$item.name}}<gcms-idname id="$item[prop]" list="{{list}}"></gcms-idname></ui-select-match>
         <ui-select-choices repeat="item in listItems track by item.id" refresh="refreshList($select.search)" refresh-delay="0">
           <div>{{item.name}}</div>
         </ui-select-choices>
       </ui-select>
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
       <ui-select id="{{id}}" name="{{id}}" multiple ng-model="model.value" required>
         <ui-select-match placeholder="Pick one...">{{$item.name}}<gcms-idname id="$item[prop]" list="{{list}}"></gcms-idname></ui-select-match>
         <ui-select-choices repeat="item in listItems track by item.id" refresh="refreshList($select.search)" refresh-delay="0">
           <div>{{item.name}}</div>
         </ui-select-choices>
       </ui-select>
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
       <ui-select id="{{id}}" name="{{id}}" multiple ng-model="model.value">
         <ui-select-match placeholder="Pick one...">{{$item.name}}<gcms-idname id="$item[prop]" list="{{list}}"></gcms-idname></ui-select-match>
         <ui-select-choices repeat="item in listItems track by item.id" refresh="refreshList($select.search)" refresh-delay="0">
           <div>{{item.name}}</div>
       </ui-select-choices>
       </ui-select>
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
       <div>
         <span id="{{id}}" ng-repeat="item in model.value track by $index">
           <gcms-idname id="item[prop]" list="{{list}}"></gcms-idname>{{$last ? '' : ($index == model.value.length - 2) ? ' and ' : ', '}}</span>
       </div>
     </div>
   </div>
 </div>
 * ```
 * @param {closure=} sectionName covered-recipient/Value-exchange/etc
 * @param {closure=} attributeName Notes/etc
 * @param {closure=} model ng-model
 * @param {closure=} state critical/optional/etc
 * @param {closure=} list list of entered values
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsMultiselect', Multiselect);

    Multiselect.$inject = ['state'];

    /**
     * @ngdoc method
     * @name Multiselect
     * @methodOf gcms.components.controls.directive:gcmsMultiselect
     * @description Constructor for the Multiselect directive
     * @param {closure=} state critical/optional/etc
     * @returns {object} Multiselect directive
     */
    function Multiselect(state) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          id: '@',
          label: '@',
          info: '@',
            attributeName: '@',
          list: '@',
          value: '=model',
          form: '=',
          prop: '@'
        },
        templateUrl: 'app/components/controls/multiselect/components.multiselect.html',
        controller: function($scope, $rootScope, $log, $filter) {
          $scope.listItems = [];
          $scope.model = {value: $scope.value || []};
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

          $scope.lov = $rootScope.session.collections[$scope.list];

          $scope.items = [];

          if (typeof ($scope.lov) === 'undefined' || typeof ($scope.lov().then) === 'undefined')
          {
            $log.error('list "' + $scope.list + '" not found...did you misspell the list name?');
            return;
          }

          $scope.refreshList = function(query){
            $scope.listItems = $filter('filter')($scope.items, query);
            $scope.listItems = $filter('limitTo')($scope.listItems, 100);
            $scope.listItems = $scope.listItems.filter(function(val){ return $filter('filter')($scope.value, { value: val.value}).length === 0; });
          };

          /**
           * @ngdoc method
           * @name updateLov
           * @methodOf gcms.components.controls.directive:gcmsLov
           * @param {object} result object
           */
          var updateLov = function(result){
            $scope.items = result;
          };

          $scope.lov().then(updateLov);

          $scope.$on('$localeChangeSuccess', function() {
            $scope.items = [];
            $scope.lov().then(updateLov);
          });

        }
      };
    }

})();
