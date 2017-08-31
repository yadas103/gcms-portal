(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsProfile', Profile);

  Profile.$inject = ['Profile','NgTableParams'];

    function Profile(Profile) {
      return {
        restrict: 'E',
        scope: {
          'update': '&'
        },
        templateUrl: 'app/recipient/search/profile.table.html',
        controller: function($scope,NgTableParams) {
        	
        	var self = this;
        	
          var updateProfile = function(result){
            $scope.profile = result;
          };

          var loadProfile = function(){
            $scope.profile = [];
            Profile.query().$promise.then(updateProfile);
          };

          loadProfile();

          $scope.$on('$localeChangeSuccess', loadProfile);

        
          $scope.update = function(item) {
            $scope.profile = item;
            Profile.update({ id: item.id }, item);
            self.tableParams = new NgTableParams({}, { dataset: profile});
            
          };
          
          $scope.checkboxes = { 'checked': false, items: {} };
          
          // watch for check all checkbox
          $scope.$watch('checkboxes.checked', function(value) {
              angular.forEach($scope.profile, function(item) {
                  if (angular.isDefined(item.id)) {
                      $scope.checkboxes.items[item.id] = value;
                  }
              });
          });

          // watch for data checkboxes
          $scope.$watch('checkboxes.items', function(values) {
              if (!$scope.profile) {
                  return;
              }
              var checked = 0, unchecked = 0,
                  total = $scope.profile.length;
              angular.forEach($scope.profile, function(item) {
                  checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                  unchecked += (!$scope.checkboxes.items[item.id]) || 0;
              });
              if ((unchecked == 0) || (checked == 0)) {
                  $scope.checkboxes.checked = (checked == total);
              }
              // grayed checkbox
              angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
          }, true);
          
        }
      };
    }
})();
