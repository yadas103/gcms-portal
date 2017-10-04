(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .controller('ProfileListCtrl', ProfileSearch);

  ProfileSearch.$inject = ['ProfileSearch','$scope','$stateParams','$state','myService','Templates','Country','IdentityRequest'];

    function ProfileSearch(ProfileSearch,$scope,$stateParams,$state,myService,Templates,Country,IdentityRequest) {
    	
        var params = {};
        $scope.orderByField = 'firstName';
        $scope.reverseSort = false;
        $scope.selectedids = [];  
        $scope.itemsByPage=20;
        
       
        var ids = [];
        var criteria = {};
        $scope.alerts = [];
       
        
        $scope.profile_types = [{
	        name: 'HCP',
	        value: 'HCP'
	    },   {
	        name: 'HCO',
	        value: 'HCO'
	    }];
        
        $scope.request = {};
   	 
        var updateCountry = function(result){
          $scope.counties = result;
        };

        var loadCountry = function(){
          $scope.counties = [];
          Country.query().$promise.then(updateCountry);
        };

        loadCountry();

        $scope.$on('$localeChangeSuccess', loadCountry);
        var collecting_country_id = {};
        $scope.submit = function(request) {
            
        	params =  request;
        	$scope.selectedids = [];
        	
        	
        	for(var i in $scope.counties){
                if ($scope.counties[i].name == request.profileCountry){
              	  collecting_country_id = $scope.counties[i].id;              
                }
              } 
        	
                ProfileSearch.get(params).$promise
                .then(function(profileSearch) {
                  $scope.profileSearch = profileSearch;             
                 
                }).catch(function(){
                	$scope.responseOnSearch = "No records to show"
                	$scope.profileSearch.length = 0;
                	$scope.profileSearchCopy.length = 0;
                	
                	
                });
             
          
          };
         
        // set criteria
       
          
          $scope.profileSearchCopy = [].concat($scope.profileSearch);
       	
       
          $scope.checkboxes = { 'checked': false, items: {} };
          
          // watch for check all checkbox
          $scope.$watch('checkboxes.checked', function(value) {
              angular.forEach($scope.profileSearch, function(item) {
                  if (angular.isDefined(item.id)) {
                      $scope.checkboxes.items[item.id] = value;
                  }
              });
          });

          // watch for data checkboxes
          $scope.$watch('checkboxes.items', function(values) {
        	  
              if (!$scope.profileSearch) {
                  return;
              }
              var checked = 0, unchecked = 0,
                  total = $scope.profileSearch.length;
              
              angular.forEach($scope.profileSearch, function(item) {
                  checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                  unchecked += (!$scope.checkboxes.items[item.id]) || 0;
                  if($scope.checkboxes.items[item.id] && ($scope.selectedids.indexOf(item) === -1)){
                	  $scope.selectedids.push(item);            	  
                  }
                  else if(!$scope.checkboxes.items[item.id] && ($scope.selectedids.indexOf(item) !== -1)){                
                	  $scope.selectedids.pop();      
               
                  }
              });
              if ((unchecked == 0) || (checked == 0)) {
                  $scope.checkboxes.checked = (checked == total);
              }
              // grayed checkbox
              angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
          }, true);
            
          $scope.closeAlert = function(index) {
              $scope.alerts.splice(index, 1);
            };
           
         
           
        
            var fn = 0;
            var ln = 0;
            var citi = 0;
            var addrs = 0;
            var note = 0;
            var orgnm = 0;
            var spl = 0; 
            
            $scope.validations = function(item){
            	$scope.alerts.length = 0;
           	 var request = item;
      	    	request.profileTypeId = item.profileTypeId.Name;
      	    	if(request.profileTypeId == 'HCP'){
      	    		if(request.firstName.length <= 100){
      	    			fn = 1;
      	    		}
      	    		if(request.lastName.length <= 100){
      	    			ln = 1;
      	    		}
      	    		if(request.city != undefined){
      	    		if(request.city.length <= 100){
      	    			citi = 1;
      	    		}
      	    		}
      	    		else if(request.city == undefined){
      	    			citi = 1;
      	    		}
      	    		if(request.notes != undefined){
      	   	    		if(request.notes.length <= 100)
      	   	    		{
      	   	    		 note = 1;
      	   	    		}
      	    		}
      	    		else if(request.notes == undefined){
      	    		 note = 1;
      	    		}
      	    		if(request.specility.length <= 100)
   	   	    		{
      	    			spl = 1;
   	   	    		}
      	    		if(request.address.length <= 1024){
      	    			addrs = 1;
      	    		}
      	    	}
      	    	else if(request.profileTypeId == 'HCO'){
      	    		if(request.organizationName.length <= 100){
      	    			orgnm = 1;
      	    		}   	    		
      	    		if(request.city != undefined){
      	   	    		if(request.city.length <= 100){
      	   	    			citi = 1;
      	   	    		}
      	   	    		}
      	   	    		else if(request.city == undefined){
      	   	    			citi = 1;
      	   	    		}
      	   	    		if(request.notes != undefined){
      	   	   	    		if(request.notes.length <= 100)
      	   	   	    		{
      	   	   	    		 note = 1;
      	   	   	    		}
      	   	    		}
      	   	    		else if(request.notes == undefined){
      	   	    		 note = 1;
      	   	    		}
      	    		if(request.specility.length <= 100)
   	   	    		{
      	    			spl = 1;
   	   	    		}
      	    		if(request.address.length <= 1024){
      	    			addrs = 1;
      	    		}
      	    	}
      	    	
      	    	if(request.profileTypeId == 'HCP')
      	    		{
      	    		if(fn == 1 && ln == 1 && citi == 1 && note == 1 && spl == 1  ){
      	    			$scope.create(item);
      	    		}
      	    		else if(fn == 0)
      	    			{
      	    			$scope.alerts.push({type:'failure', msg: 'First Name has more than 100 characters.Max size is 100'});
      	    			}
      	    		else if(ln == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Last Name has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(citi == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'City has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(note == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Notes has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(spl == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Specility has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(addrs == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Address has more than 100 characters.Max size is 1024'});
  	    			}
      	    		}
      	    	else if(request.profileTypeId == 'HCO')
      	    		{
      	    		if(orgnm == 1 && citi == 1 && note == 1 && spl == 1  ){
      	    			$scope.create(item);
      	    		}
      	    		else if(orgnm == 0)
      	    			{
      	    			$scope.alerts.push({type:'failure', msg: 'Organization Name has more than 100 characters.Max size is 100'});
      	    			}
      	    		else if(citi == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'City has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(note == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Notes has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(spl == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Specility has more than 100 characters.Max size is 100'});
  	    			}
      	    		else if(addrs == 0){
      	    			$scope.alerts.push({type:'failure', msg: 'Address has more than 100 characters.Max size is 1024'});
  	    			}
      	    		}
      	    
            }
            
            
         $scope.create = function(item){
        	 var request = item;
  	    	request.profileTypeId = item.profileTypeId;
  	    	IdentityRequest.save(request).$promise
              .then(function(result) {
                  if(result.$promise.$$state.status == 1)
              	{
                  	$scope.responseOnSave = "Saved successfully";
                  	}
                 
                }).catch(function(){
              	  $scope.responseOnUnsave = "Unable to save record";
                });
          };
                
      
          $scope.list = function(){
        	  var selid = 'selid';
        	  var selectedParams = 'selectedParams';
        	  var collectingCtry = 'collectingCtry';
              ids[selid] =  {checked: JSON.stringify($scope.selectedids)};
              ids[selectedParams] = {selection: JSON.stringify(params)}
              ids[collectingCtry] = collecting_country_id;
           myService.set(ids);
          };
          
          $scope.submitid = function(id) {
     		 
              $state.go('profile-detail-view', {id} );
            };
          
       
    }
})();
