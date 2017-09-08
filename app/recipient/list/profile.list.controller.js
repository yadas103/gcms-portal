(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .controller('ProfileListCtrl', ProfileSearch);

  ProfileSearch.$inject = ['ProfileSearch','$scope','$stateParams','$state','myService'];

    function ProfileSearch(ProfileSearch,$scope,$stateParams,$state,myService) {
    	
        var params = JSON.parse($stateParams.criteria);
        
        $scope.orderByField = 'firstName';
        $scope.reverseSort = false;
        $scope.selectedids = [];
        $scope.itemsByPage=5;
        
        var ids = [];
     /*   var lastname = [];
        var firstname = [];*/
  
        // set criteria
        if($stateParams.criteria !== '[object Object]'){
          $scope.criteria = JSON.parse($stateParams.criteria);
        }
        $scope.profileSearch = {};
        $scope.profileSearchCopy = {};

        var getData = function(){           
            
            if($stateParams.profileSearch) {
          	$scope.profileSearch = $stateParams.profileSearch;
          
              return;
            }

            ProfileSearch.get(params).$promise
            .then(function(profileSearch) {
              $scope.profileSearch = profileSearch;             
             
            }).catch(function(){
              $state.go('no-permission');
            });
          };
          $scope.profileSearchCopy = [].concat($scope.profileSearch);
       	
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
            
          };
          
          $scope.checkboxes = { 'checked': false, items: {} };
          
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
        	  
              if (!$scope.profileSearch) {
                  return;
              }
              var checked = 0, unchecked = 0,
                  total = $scope.profileSearch.length;
              
              angular.forEach($scope.profileSearch, function(item) {
                  checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                  unchecked += (!$scope.checkboxes.items[item.id]) || 0;
                  if($scope.checkboxes.items[item.id] && ($scope.selectedids.indexOf(item.id) === -1)){
                	  $scope.selectedids.push(item.id);
                  }
              });
              if ((unchecked == 0) || (checked == 0)) {
                  $scope.checkboxes.checked = (checked == total);
              }
              // grayed checkbox
              angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
          }, true);
            
          
          	      $scope.create = function(item){
            $scope.result()(item);
          };
          
          $scope.list = function(){
           ids = $scope.selectedids;
           myService.set(JSON.stringify(ids));
          };
          
          
          
       
    }
})();
