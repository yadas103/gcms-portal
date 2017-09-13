(function () {

  'use strict';

  angular
    .module('gcms.identity')
    .controller('IdentityListCtrl', IdentitySearch);

  IdentitySearch.$inject = ['IdentitySearch','$scope','$stateParams'];

    function IdentitySearch(IdentitySearch,$scope,$stateParams) {
    	
        var params = JSON.parse($stateParams.criteria);
        // set criteria
        if($stateParams.criteria !== '[object Object]'){
          $scope.criteria = JSON.parse($stateParams.criteria);
        }
        $scope.IdentitySearch = {};

        var getData = function(){           
            $scope.IdentitySearchCopy = null;
            if($stateParams.IdentitySearch) {
          	$scope.IdentitySearch = $stateParams.IdentitySearch;
            $scope.IdentitySearchCopy = angular.copy($stateParams.IdentitySearch);
              return;
            }

            IdentitySearch.get(params).$promise
            .then(function(IdentitySearch) {
              $scope.IdentitySearch = IdentitySearch;             
              $scope.IdentitySearchCopy = angular.copy(IdentitySearch);
            }).catch(function(){
              $state.go('no-permission');
            });
          };
       	
        console.log(params);
          var updateProfile = function(result){
            $scope.IdentitySearch = result;
          };

          var loadProfile = function(){
            $scope.IdentitySearch = [];
            IdentitySearch.query(params).$promise.then(updateProfile);
          };

          loadProfile();

          $scope.$on('$localeChangeSuccess', loadProfile);

        
          $scope.update = function(item) {
            $scope.IdentitySearch = item;
            IdentitySearch.update({ id: item.id }, item);
           
            
          };
          
          
         
         
              
    }
})();
