
(function () {
  'use strict';

  angular
  .module('gcms.recipient')
  .controller('ConsentAnnexCtrl', ConsentAnnex);
 

  ConsentAnnex.$inject = ['$rootScope', '$scope', '$state', 'ConsentAnnex','Profile'];


  function ConsentAnnex($rootScope, $scope, $state,ConsentAnnex,Profile){
    
	console.log("Inside controller");
	
	$scope.tableRowExpanded = false;
    $scope.tableRowIndexCurrExpanded = "";
    $scope.tableRowIndexPrevExpanded = "";
    $scope.profileIdExpanded = "";
    $scope.dataCollapse=[];
    
    $scope.dataCollapseFn = function () {
        for (var i = 0; $scope.dataModel.ConsentAnnex.length - 1; i += 1) {
            $scope.dataCollapse.append('true');
            
        }
    };
    
  
    
    $scope.selectTableRow = function (index, profileId) {
      
      

      if ($scope.dataCollapse === 'undefined') {
            $scope.dataCollapse = $scope.dataCollapseFn();
            
      } else {
    	
    	if ($scope.tableRowExpanded === false && $scope.tableRowIndexCurrExpanded === "" && $scope.profileIdExpanded === "") {
                $scope.tableRowIndexPrevExpanded = "";
                $scope.tableRowExpanded = true;
                $scope.tableRowIndexCurrExpanded = index;
                $scope.profileIdExpanded = profileId;
                $scope.dataCollapse[index] = true;
    	
    	}else if ($scope.tableRowExpanded === true) {
    	   if ($scope.tableRowIndexCurrExpanded === index && $scope.profileIdExpanded === profileId) {
    	     
    	            $scope.tableRowExpanded = false;
                    $scope.tableRowIndexCurrExpanded = "";
                    $scope.profileIdExpanded = "";
                    $scope.dataCollapse[index] = false;
    	  
    	    }else{
    	      
    	              $scope.tableRowIndexPrevExpanded = $scope.tableRowIndexCurrExpanded;
                    $scope.tableRowIndexCurrExpanded = index;
                    $scope.profileIdExpanded = profileId;
                    $scope.dataCollapse[$scope.tableRowIndexPrevExpanded] = false;
                    $scope.dataCollapse[$scope.tableRowIndexCurrExpanded] = true;
    	      
    	      
    	    }
    	  
    	   
    	}
        
      }  
    };
	  

    var getData = function(){
     return ConsentAnnex.query().$promise.then(function(consent){
       $scope.ConsentAttributes = consent;
       console.log(consent);
      });
    };
   
    var getProfileData = function(){
        return Profile.query().$promise.then(function(profile){
          $scope.ProfileAttributes = profile;
          console.log(profile);
         });
       };
  
    getData();
    getProfileData();
    console.log(getData);
 
    $scope.$on('$localeChangeSuccess', getData);

  }
})();
