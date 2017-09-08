(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsAnnex', Annex);

  Annex.$inject = ['myService'];

    function Annex(myService) {
      return {       
        templateUrl: 'app/recipient/generateAnnex/profile.annex.view.html',
        controller: function($scope) {
        	
            
            $scope.generateConsentAnnex = {};
            $scope.id = [];

            var getData = function(){                                           	

            	
                  $scope.generateConsentAnnex =  JSON.parse(myService.get());   
                  $scope.id = $scope.generateConsentAnnex[0];
              };
              getData(); 
        }
      };
    }
        
    	})();
