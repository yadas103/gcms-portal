
(function () {
  'use strict';

  angular
    .module('gcms.identity')
    .controller('ProfileReviewController', IdCon);

    IdCon.$inject = ['$rootScope', '$scope'];

    function IdCon($rootScope, $scope){
    	
    	
        
    	$scope.employees = [
            {
                 name: "Ben", dateOfBirth: new Date("November 23, 1980"),
                gender: "Male", salary: 55000
            },
			 {
                 name: "deb", dateOfBirth: new Date("November 23, 1980"),
                gender: "Male", salary: 55000
            },
			 {
                 name: "cebn", dateOfBirth: new Date("November 23, 1980"),
                gender: "Male", salary: 55000
            },
			
            
            
            
            
        ];
		
        $scope.orderByField = 'name';
        $scope.reverseSort = false; 
        
        

      }


})();
