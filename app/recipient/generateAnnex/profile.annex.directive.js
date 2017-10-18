(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsAnnex', Annex);

  Annex.$inject = ['myService','Templates','$stateParams','$filter','$state','ConsentAnnex','Country'];

    function Annex(myService,Templates,$stateParams,$filter,$state,ConsentAnnex,Country) {
    	 return {
         	restrict: 'E',
             scope: {            
               'update': '&'
             },
        templateUrl: 'app/recipient/generateAnnex/profile.annex.view.html',
        controller: function($scope) {        	
        
            $scope.generateConsentAnnex = {};
            $scope.id = [];  
            $scope.checked = [];
            $scope.cntry = {};
            $scope.cntryValue = {};   
            $scope.filterTempalates = [];
            $scope.templId = {};
            $scope.profileCountry_Id = {};
            var profileData = {};
           
            
            
            var getData = function(){                                           	            	
            	$scope.id =  myService.get(); 
            	 $scope.checkedIds = $scope.id.selid.checked;
            	 $scope.checkedIds = JSON.parse($scope.checkedIds);
            	 $scope.cntryValue = $scope.id.selectedParams.selection;
            	 $scope.searchCriteria = JSON.parse($scope.cntryValue);
            	 $scope.cntryValue = $scope.searchCriteria.country;
            	 
            	 
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
                                  
          
                
              
                  var y = 0;
                  
                  $scope.submit = function(request){ 
                	  
                	for(y in $scope.checkedIds ){
                	 var values = $scope.checkedIds;               	 
                	 var profilecountry = 'profilecountry';
                	 var payercountry = 'payercountry';
                	 var profileType = 'profileType';
                	 var bpid = 'bpid';
                	 $scope.cntry = $scope.id.selection;
                	 request.tmpl_id = {id: JSON.stringify($scope.templId)};            
                	 request[profilecountry] = {id: JSON.stringify($scope.id.collectingCtry)};
                	 request[payercountry] = {id: JSON.stringify($scope.profileCountry_Id)}; // Need to replace it to $scope.cntry.country; from $scope.cntry.profileCountry;
                	 request[profileType] = $scope.searchCriteria.profileType;                	
                	 request[bpid] = {id: JSON.stringify(values[y].id)};
                	 ConsentAnnex.save(request).$promise.then(function(result) {
                         if(result.$promise.$$state.status == 1)
                     	{
                     	$scope.msg = "You can see the generated PDF in your Downloads folder";
                     	}
                    
                   }).catch(function(){
                 	  $scope.msg = "Unable to generate PDF";
                   });
                  }
                	 //y++;
                	 
                	  
  				};
  				
  				$scope.submittry = function(){ 
  					console.log($scope.checkedIds);
  					var values = $scope.checkedIds;               	 
  					var profilecountry = 'profilecountry';
  					var payercountry = 'payercountry';
  					var profileType = 'profileType';
  					var bpid = 'bpid';
  					var tmpl_id = 'tmpl_id';
  					var eventname = 'eventname';
  					
  					var modifiedparams = {};
  					  					
  					for(y in $scope.checkedIds ){
  						if(y!="request"){
  					var currentId = values[y].id; 	
  					
  				
  					modifiedparams['payercountry'] = {id: JSON.stringify($scope.profileCountry_Id)};
  					modifiedparams['profilecountry'] = {id: JSON.stringify($scope.id.collectingCtry)};
  					modifiedparams['profileType'] = $scope.searchCriteria.profileType;
  					modifiedparams['bpid'] = {id: currentId};
  					modifiedparams['tmpl_id'] = {id: JSON.stringify($scope.checkedIds.request[currentId].tmpl_id)};
  					modifiedparams['eventname'] = $scope.checkedIds.request[currentId].eventname;
  					modifiedparams['pocode'] = $scope.checkedIds.request[currentId].pocode;
  					modifiedparams['acmcode'] = $scope.checkedIds.request[currentId].acmcode;
  					console.log(modifiedparams);
  				  	 ConsentAnnex.save(modifiedparams).$promise.then(function(result) {
                         if(result.$promise.$$state.status == 1)
                     	{
                     	$scope.msg = "You can see the generated PDF in your Downloads folder";
                     	}
                    
                   }).catch(function(){
                 	  $scope.msg = "Unable to generate PDF";
                   });
  						}
  						
  					}
  					
  					
  				};
  				
              
               
        }
        
      };
    }
    
        
    	})();
