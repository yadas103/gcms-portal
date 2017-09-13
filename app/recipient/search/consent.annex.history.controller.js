
(function () {
  'use strict';

  angular
  .module('gcms.recipient')
  .controller('ConsentAnnexCtrl', ConsentAnnex);
 

  ConsentAnnex.$inject = ['$rootScope', '$scope', '$state','$location','$stateParams','ConsentAnnex','Profile'];


  function ConsentAnnex($rootScope, $scope, $state,$location,$stateParams,ConsentAnnex,Profile){
    
	console.log("Inside controller");
	
	var Profileid=$stateParams.id;
	
	$scope.id=$stateParams.id;
	  
	console.log(Profileid);
	console.log($scope.id);
	
    var getData = function(){
     return ConsentAnnex.query().$promise.then(function(consent){
       
       $scope.ConsentAttributes = consent;
       console.log(consent);

       
      });
    };
    
    
   
    var getProfileData = function(){
        return Profile.query().$promise.then(function(Profile){
          $scope.ProfileAttribute= Profile;
          
         });
    };
  
    getData();
    getProfileData();
    console.log(getData);
 
    $scope.$on('$localeChangeSuccess', getData);

  }
})();
