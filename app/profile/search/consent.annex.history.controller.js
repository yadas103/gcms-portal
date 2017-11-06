/**
 * @ngdoc overview
 * @name gcms.profile.ConsentAnnexCtrl
 *
 * @requires gcms.profile
 *
 * @description Controller: Handles Consent History View page.
 * 
 * @param $rootScope, $scope, $state,$location,$stateParams,ConsentAnnex,Profile
 */

(function () {
  'use strict';

  angular
  .module('gcms.profile')
  .controller('ConsentAnnexCtrl', ConsentAnnex);
 

  ConsentAnnex.$inject = ['$rootScope', '$scope', '$state','$location','$stateParams','ConsentAnnex','Profile'];


  function ConsentAnnex($rootScope, $scope, $state,$location,$stateParams,ConsentAnnex,Profile){    
	console.log("Inside controller");
	
	var profileid=$stateParams.id;
 
	console.log(profileid);

    var getData = function(){
     return ConsentAnnex.query({id : profileid}).$promise.then(function(consent){  
    	 if(consent.length>0){
       $scope.ConsentAttributes = consent;

    	 }else{
    		 $scope.error = "No Records Found";
    	 }
       console.log(consent); 
      }).catch(function(){
    	  console.log("No Records Found");
    	  $scope.error = "No Records Found";
      });
     
    };
    getData();
    $scope.displayedCollection = [].concat($scope.ConsentAttributes);
   
    console.log(getData);
    $scope.$on('$localeChangeSuccess', getData);
  }
})();
