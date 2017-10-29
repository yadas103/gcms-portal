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
	var Profileid=$stateParams.id;	
	$scope.id=$stateParams.id;
    var getData = function(){
     return ConsentAnnex.query().$promise.then(function(consent){      
       $scope.ConsentAttributes = consent;     
      });
     
    };
  
    var getProfileData = function(){
        return Profile.query().$promise.then(function(Profile){
          $scope.ProfileAttribute= Profile;         
         });
    };  
    getData();
    getProfileData();
    $scope.$on('$localeChangeSuccess', getData);
  }
})();
