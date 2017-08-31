/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsLov
 * @scope
 * @restrict E
 *
 * @description
 * Provides a drop down select list based on a list of values
 *
 * ```html
 <span ng-switch="state">
 	<select ng-switch-when="critical" id="{{id}}" name="{{id}}" class="form-control" ng-model="model.value" ng-options="item.id as item.name for item in items | unique:'name'" gcms-critical ng-disabled="{{disabled}}"><option value="" ng-show="{{empty}}"></option></select>
 	<select ng-switch-when="required" id="{{id}}" name="{{id}}" class="form-control" ng-model="model.value" ng-options="item.id as item.name for item in items | unique:'name'" required ng-disabled="{{disabled}}"><option value="" ng-show="{{empty}}"></option></select>
 	<select ng-switch-default id="{{id}}" name="{{id}}" class="form-control" ng-model="model.value" ng-options="item.id as item.name for item in items | unique:'name'" {{required}} ng-disabled="{{disabled}}"><option value="" ng-show="{{empty}}"></option></select>
 </span>
 * ```
 *
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsLov', gcmsLov);

    gcmsLov.$inject = [];

    /**
     * @ngdoc method
     * @name gcmsLov
     * @methodOf gcms.components.controls.directive:gcmsLov
     * @description Provides a drop down list based on a particular set of values
     * @returns {object} gcmsLov directive
     */
    function gcmsLov() {
      return {
        restrict: 'E',
        scope: {
          id: '@',
          list: '@',
          state: '=',
          value: '=',
          form: '=',
          lov: '@',
          disabled: '@',
          empty: '@'
        },
        templateUrl: 'app/components/controls/lov/components.controls.lov.directive.html',
        controller: function($scope, $rootScope, $log) {
          // scope variables
          $scope.disabled = $scope.disabled ? ($scope.disabled === 'true') : false;
          $scope.empty = $scope.empty ? ($scope.empty === 'true') : true;
          $scope.lov = $rootScope.session.collections[$scope.list];
          $scope.model = {value: $scope.value };

          if (typeof ($scope.lov) === 'undefined' || typeof ($scope.lov().then) === 'undefined'){
            $log.error('list "' + $scope.list + '" not found...did you misspell the list name?');
            return;
          }

          $scope.$watch('model.value', function(value) {
            $scope.value = value;
          });

          $scope.$watch('value', function(value){
            $scope.model = { value : value };
          });

          /**
           * @ngdoc method
           * @name updateLov
           * @methodOf gcms.components.controls.directive:gcmsLov
           * @param {object} result The result returned from the lov service call
           */
          var updateLov = function(result){
            $scope.items = [];

            if(typeof $scope.id === 'string'){
              $scope.value = parseInt($scope.value) || $scope.value;
            }

            for (var i in result){
              if (result[i].id) {
                $scope.items.push(result[i]);
              }
            }
          };

          $scope.lov().then(updateLov);

          $scope.$on('$localeChangeSuccess', function() {
            $scope.lov().then(updateLov);
          });
        }
      };
    }

  })();
