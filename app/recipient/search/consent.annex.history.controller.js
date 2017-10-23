
(function () {
  'use strict';

  angular
  .module('gcms.recipient')
  .controller('ConsentAnnexCtrl', ConsentAnnex);
 

  ConsentAnnex.$inject = ['$rootScope', '$scope', '$state','$location','$stateParams','ConsentAnnex','Profile'];


  function ConsentAnnex($rootScope, $scope, $state,$location,$stateParams,ConsentAnnex,Profile){
    
	console.log("Inside controller");
	
	var profileid=$stateParams.id;
	
	//$scope.id=$stateParams.id;
	  
	console.log(profileid);
	//console.log($scope.id);
	
    var getData = function(){
     return ConsentAnnex.query({id : profileid}).$promise.then(function(consent){  
    	 if(consent.length>0){
       $scope.ConsentAttributes = consent;
    	 }else{
    		 $scope.error = "No Records Found";
    	 }
       console.log(consent); 
      }).catch(function(){
    	  console.log("No Record Found");
    	  $scope.error = "No Record Found";
      });
     
    };
    getData();
    $scope.displayedCollection = [].concat($scope.ConsentAttributes);
   
   /* var getProfileData = function(){
        return Profile.query().$promise.then(function(Profile){
          $scope.ProfileAttribute= Profile;
          
         });
    };

    getProfileData();*/
    
    console.log(getData);
    $scope.$on('$localeChangeSuccess', getData);

  }
})();
