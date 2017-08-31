/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsMultitextbox
 * @scope
 * @restrict E
 *
 * @description
 * Provides a multi textbox for critical, required, and optional states.
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
       <ui-select id="{{id}}" name="{{id}}" class="form-control" multiple tagging="tagTransform" tagging-label="false" tagging-tokens="ENTER" ng-model="model.value" required >
       <!-- gcms-critical -->
         <ui-select-match placeholder="Add one...">{{$item[prop]}}</ui-select-match>
         <ui-select-choices repeat="item in model.value">
           <div>{{item[prop]}}</div>
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
       <ui-select id="{{id}}" name="{{id}}" class="form-control" multiple tagging="tagTransform" tagging-label="false" tagging-tokens="ENTER" ng-model="model.value" required>
         <ui-select-match placeholder="Add one...">{{$item[prop]}}</ui-select-match>
         <ui-select-choices repeat="item in model.value">
           <div>{{item[prop]}}</div>
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
       <ui-select id="{{id}}" name="{{id}}" class="form-control" multiple tagging="tagTransform" tagging-label="false" tagging-tokens="ENTER" ng-model="model.value">
         <ui-select-match placeholder="Add one...">{{$item[prop]}}</ui-select-match>
         <ui-select-choices repeat="item in model.value">
           <div>{{item[prop]}}</div>
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
         <span id="{{id}}" ng-repeat="item in model.value">{{item[prop]}}{{$last ? '' : ($index == model.value.length - 2) ? ' and ' : ', '}}</span>
       </div>
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
    .directive('gcmsMultitextbox', Multitextbox);

  Multitextbox.$inject = ['state', 'length'];

  /**
   * @ngdoc method
   * @name Multitextbox
   * @methodOf gcms.components.controls.directive:gcmsMultitextbox
   * @description Constructor for the Multitextbox directive
   * @returns {object} Multitextbox directive
   */
  function Multitextbox(state, length) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        id: '@',
        label: '@',
        info: '@',
        attributeName: '@',
        value: '=model',
        form: '=',
        prop: '@',
        baseTag: '='
      },
      templateUrl: 'app/components/controls/multitextbox/components.multitextbox.html',
      controller: function($scope) {

        $scope.model = {value: $scope.value || []};

        $scope.$watch('model.value', function() {
          $scope.model.value = $scope.model.value || [];
          $scope.value = $scope.model.value;
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
         * @methodOf gcms.components.controls.directive:gcmsMultitextbox
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

        $scope.tagTransform = function (newTag) {
          var tag = {};
          //JSON.parse(JSON.stringify($scope.baseTag));
          angular.extend(tag, $scope.baseTag);
          // var tag = $scope.baseTag;
          if(newTag.toString().length>$scope.maxLength){
        	  newTag = newTag.toString().substr(0,$scope.maxLength);
          }
          tag[$scope.prop] = newTag;
          return tag;
        };

      }
    };
  }

})();
