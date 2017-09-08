(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .controller('GenerateConsentAnnexCtrl', myService);

  myService.$inject = ['myService','$scope'];

    function myService(myService,$scope) {
    	
     
        $scope.generateConsentAnnex = {};

        var getData = function(){                                           	

        	myService.get().$promise
            .then(function(generateConsentAnnex) {
              $scope.generateConsentAnnex = generateConsentAnnex;                        
            }).catch(function(){
              $state.go('no-permission');
            });
          };
       	
        console.log(params);
          var updateProfile = function(result){
            $scope.generateConsentAnnex = result;
          };

          var loadProfile = function(){
        	  myService.get().$promise.then(updateProfile);
          };

          loadProfile();

          $scope.$on('$localeChangeSuccess', loadProfile);
                  
          
              }
})();
