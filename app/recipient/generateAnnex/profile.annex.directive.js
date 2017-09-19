(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsAnnex', Annex);

  Annex.$inject = ['myService','Templates','$stateParams','$filter','GenerateAnnex','$state','ConsentAnnex','Country'];

    function Annex(myService,Templates,$stateParams,$filter,GenerateAnnex,$state,ConsentAnnex,Country) {
    	 return {
         	restrict: 'E',
             scope: {            
               'update': '&'
             },
        templateUrl: 'app/recipient/generateAnnex/profile.annex.view.html',
        controller: function($scope) {        	
           
            $scope.generateConsentAnnex = {};
            $scope.id = [];   
            $scope.cntry = JSON.parse($stateParams.criteria);
            $scope.cntryValue = $scope.cntry.country;   
            $scope.filterTempalates = [];
            $scope.templId = {};
            $scope.profileCountry_Id = {};
            var profileData = {};
            var countryData = {};
            
            var getData = function(){                                           	            	
            	$scope.id =  JSON.parse(myService.get());                    
              };
              getData(); 
              
              var updateTemplates = function(result){
                  $scope.templates = result;                
                };     
                
                $scope.customArrayFilter = function (result) {
                	if(result.cntry_id.name == $scope.cntryValue){
                		$scope.templId = result.id;
                		$scope.profileCountry_Id = result.cntry_id.id;
                	}
                    return (result.cntry_id.name == $scope.cntryValue);
                  }
                
                var loadTemplates = function(){
                  $scope.templates = [];
                  Templates.query().$promise.then(updateTemplates);
                };

                loadTemplates();

                $scope.$on('$localeChangeSuccess', loadTemplates);
                
                $scope.update = function(item) {
                    $scope.templates = item;
                    Templates.update({ id: item.id }, item);     
                  };
                                  
                  
                  var getCountryData = function(){
                      return Country.query().$promise.then(function(Country){
                        countryData = Country;
                        
                       });
                  };
                
                  getCountryData();
               
                  var y = 0;
                  $scope.submit = function(request){                 	
                	
                	 var values = $scope.id;                	 
                	 var profilecountry = 'profilecountry';
                	 var payercountry = 'payercountry';
                	 var profileType = 'profileType';
                	 var bpid = 'bpid';
                	 request.tmpl_id = {id: JSON.stringify($scope.templId)};            
                	 request[profilecountry] = {id: JSON.stringify($scope.cntry.profileCountry)};
                	 request[payercountry] = {id: JSON.stringify($scope.profileCountry_Id)}; // Need to replace it to $scope.cntry.country; from $scope.cntry.profileCountry;
                	 request[profileType] = $scope.cntry.profileType;                	
                	 request[bpid] = {id: JSON.stringify(values[y].id)};
                	 ConsentAnnex.save(request).$promise.then(function (data) {
                	
                	 });
                	 y++;
                	 
                	  
  				};
              
               
        }
        
      };
    }
    
        
    	})();
