(function () {

  'use strict';

  angular
    .module('gcms.identity')
    .directive('gcmsProfile', Profile);

  Profile.$inject = ['Profile'];

    function Profile(Profile) {
      return {
        restrict: 'E',
        scope: {
          'update': '&'
        },
        templateUrl: 'app/profilereview/identitydetail/identityProfile.html',
        controller: function($scope) {
        	
        	
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
           
            
          };
         }
      };
    }
})();
