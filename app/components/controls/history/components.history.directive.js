/**
 * @ngdoc directive
 * @name gcms.components.controls.directive:gcmsHistory
 * @scope
 * @restrict E
 *
 * @description
 * This directive displays change history data for a recipient.
 *
 * ```html
 <div class="panel panel-primary">
   <div class="panel-heading">
     Change History
   </div>
   <div class="panel-body">
     <table class="table table-hover">
       <thead>
         <tr>
           <th>Field</th>
           <th>Old value</th>
           <th>New Value</th>
           <th>User</th>
            <th>Change Reason</th>
           <th>Date</th>
           <th>Time</th>
           <th>Timezone</th>
         </tr>
       </thead>
       <tbody>
        <tr ng-if="!history && !isLoading">
           <td colspan="8">
             <a ng-click="load()">
               <span><i class="fa fa-2x fa-history"></i></span>
               <span>Load History</span>
             </a>
           </td>
         </tr>
         <tr ng-if="!history && isLoading">
           <td colspan="8">
             <a ng-click="load()">
               <span><i class="fa fa-2x fa-spin fa-cog"></i></span>
               <span>...</span>
             </a>
           </td>
         </tr>
         <tr ng-if="isLoading && !isData">
          <td colspan="8">No history data</td>
         </tr>
         <tr ng-repeat="item in history track by $index">
           <td>{{attributeMap[item.tableName][item.field] || item.tableName + '.' + item.field }}</td>
           <td>{{item.oldValue}}</td>
           <td>{{item.newValue}}</td>
           <td>{{item.updatedBy}}</td>
           <td>{{item.changeReason}}</td>
           <td>{{convertToDate(item.historyUpdatedDateString) | date:'shortDate'}}</td>
           <td>{{item.historyUpdatedDateTimeString}}</td>
           <td>{{item.timeZone}}</td>
         </tr>
       </tbody>
     </table>
   </div>
 </div>
 * ```
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsHistory', History);

    History.$inject = ['$rootScope'];

    /**
     * @ngdoc method
     * @name History
     * @methodOf gcms.components.controls.directive:gcmsHistory
     * @description Constructor for the History directive
     * @returns {object} History directive
     */
    function History($rootScope) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          history: '=',
          doLoad: '&load'
        },
        templateUrl: 'app/components/controls/history/components.history.html',
        controller: function($scope){
          // scope variables
          $scope.isLoading = false;
          $scope.isData = true;

          /**
           * @ngdoc method
           * @name load
           * @methodOf gcms.components.controls.directive:gcmsHistory
           * @description Loads the history data
           */
          $scope.load = function(){
            $scope.isLoading = true;
            $scope.doLoad()();
          };

          /**
           * @ngdoc method
           * @name convertStringToDate
           * @methodOf gcms.components.controls.directive:gcmsHistory
           * @description Convert string into date object
           */
          $scope.convertStringToDate = function(serverDate){
            return new Date(serverDate);
          };

          /**
           * @ngdoc method
           * @methodOf gcms.components.controls.directive:gcmsHistory
           * @description Populates isData scope variable
           */
          $scope.$watch('history', function(item){
            if ($scope.isLoading){
              if (item !== null && item.length > 0){
                $scope.isData = true;
              }else{
                $scope.isData = false;
              }
            }
          });

          $scope.attributeMap = false;
          return $rootScope.session.user.getCurrentProfile().then(function(profile){
            var countryId = profile.countryId;
            return $rootScope.session.user.getAttributes(countryId);
          }).then(function(attributes){
            if(!$scope.attributeMap){
              $scope.attributeMap = {};
              attributes.forEach(function(value){
                if(!$scope.attributeMap[value.tableName]) { $scope.attributeMap[value.tableName] = {}; }
                $scope.attributeMap[value.tableName][value.columnName] = value.attributeName;
              });
            }
          });
        }
      };
    }

})();
