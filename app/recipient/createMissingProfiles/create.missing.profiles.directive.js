(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsIdentity', IdentityRequest);

  IdentityRequest.$inject = ['IdentityRequest','$state','$stateParams'];

    function IdentityRequest(IdentityRequest,$state,$stateParams) {
      return {
        restrict: 'E',
        scope: {
          request: '@',
	      criteria: '='
        },
        templateUrl: 'app/recipient/createMissingProfiles/create.missing.profile.html',
        controller: function($scope) {
    	               	 
        	 $scope.add = function (new1Value) {
        	        var obj = {};
        	        obj.Name = new1Value;
        	        obj.Value = new1Value;
        	        $scope.Groupss.push(obj);
        	        $scope.group1.name = obj;
        	        $scope.new1Value = '';
        	    } 

        	    $scope.Groupss = [{
        	        Name: 'HCP',
        	        Value: 'HCP'
        	    },   {
        	        Name: 'HCO',
        	        Value: 'HCO'
        	    }];
        	    $scope.group1 = {
        	        name: ""
        	    }
        
        	    
        	    $scope.submit = function(item){
        	    	var request = item;
        	    	
				
        	    	IdentityRequest.save(request).$promise
                    .then(function(result) {
                        if(result.$promise.$$state.status == 1)
                        	{
                        	$scope.responseOnSave = "Saved successfully";
                        	}
                       
                      }).catch(function(){
                    	  $scope.responseOnSave = "Unable to save record";
                      });
                   
									
				};
  
        }
      };
    }
    
})();
