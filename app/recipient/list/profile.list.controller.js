(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .controller('ProfileListCtrl', ProfileSearch);

  ProfileSearch.$inject = ['ProfileSearch','$scope','NgTableParams','$stateParams'];

    function ProfileSearch(ProfileSearch,$scope,NgTableParams,$stateParams) {
    	var self = this;
        var params = JSON.parse($stateParams.criteria);
        // set criteria
        if($stateParams.criteria !== '[object Object]'){
          $scope.criteria = JSON.parse($stateParams.criteria);
        }
        $scope.profileSearch = {};

        var getData = function(){           
            $scope.profileSearchCopy = null;
            if($stateParams.profileSearch) {
          	$scope.profileSearch = $stateParams.profileSearch;
            $scope.profileSearchCopy = angular.copy($stateParams.profileSearch);
              return;
            }

            ProfileSearch.get(params).$promise
            .then(function(profileSearch) {
              $scope.profileSearch = profileSearch;             
              $scope.profileSearchCopy = angular.copy(profileSearch);
            }).catch(function(){
              $state.go('no-permission');
            });
          };
       	
        console.log(params);
          var updateProfile = function(result){
            $scope.profileSearch = result;
          };

          var loadProfile = function(){
            $scope.profileSearch = [];
            ProfileSearch.query(params).$promise.then(updateProfile);
          };

          loadProfile();

          $scope.$on('$localeChangeSuccess', loadProfile);

        
          $scope.update = function(item) {
            $scope.profileSearch = item;
            ProfileSearch.update({ id: item.id }, item);
            self.tableParams = new NgTableParams({}, { dataset: profileSearch});
            
          };
          
          $scope.checkboxes = { 'checked': false, items: {} };
          $scope.selectedIds = [];
          // watch for check all checkbox
          $scope.$watch('checkboxes.checked', function(value) {
              angular.forEach($scope.profileSearch, function(item) {
                  if (angular.isDefined(item.id)) {
                      $scope.checkboxes.items[item.id] = value;
                  }
              });
          });

          // watch for data checkboxes
          $scope.$watch('checkboxes.items', function(values) {
        	  if(values){
        		  $scope.selectedIds.push(values);
        	  }
              if (!$scope.profileSearch) {
                  return;
              }
              var checked = 0, unchecked = 0,
                  total = $scope.profileSearch.length;
              
              angular.forEach($scope.profileSearch, function(item) {
                  checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                  unchecked += (!$scope.checkboxes.items[item.id]) || 0;
                  
              });
              if ((unchecked == 0) || (checked == 0)) {
                  $scope.checkboxes.checked = (checked == total);
              }
              // grayed checkbox
              angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
          }, true);
            
          var list = function(){
           $stateParams.selectedIds = JSON.stringify($scope.selectedIds);
           $state.go('selected-profiles', {selectedIds: JSON.stringify(selectedIds) } );
          };
          
       
    }
})();
