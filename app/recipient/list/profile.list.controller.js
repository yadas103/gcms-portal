(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .controller('ProfileListCtrl', ProfileSearch);

  ProfileSearch.$inject = ['ProfileSearch','$scope','$http','$stateParams','$state','myService','Templates','Country','IdentityRequest','Review','EmailGeneration','UserProfile','LoggedUserDetail','ConsentAnnex','ConsentAnnexPdf'];

    function ProfileSearch(ProfileSearch,$scope,$http,$stateParams,$state,myService,Templates,Country,IdentityRequest,Review,EmailGeneration,UserProfile,LoggedUserDetail,ConsentAnnex,ctrl,ConsentAnnexPdf) {
    	
        var params = {};
        $scope.orderByField = 'firstName';
        $scope.reverseSort = false;
        $scope.selectedids = [];  
        $scope.itemsByPage=20;
        $scope.dataToSend = {checkedIds :{},templates :{}};
      
    	
   
        
       
        var ids = [];
        var criteria = {};
        $scope.alerts = [];
        $scope.profile = {};
       
        
        $scope.profile_types = [{
	        name: 'HCP',
	        value: 'HCP'
	    },   {
	        name: 'HCO',
	        value: 'HCO'
	    }];
        
        $scope.userProfileData = function(){        	
        	
        	 UserProfile.query().$promise
            .then(function(profiles) {
              $scope.profiles_data = profiles;  
           
              LoggedUserDetail.query().$promise
              .then(function(loggedInUser) {
                $scope.logged_In_User = loggedInUser;  
             
                for(var i in $scope.profiles_data){
                    if ($scope.profiles_data[i].userName == $scope.logged_In_User.userName){
                  	  $scope.loggedInUserCountry = $scope.profiles_data[i].countryId ;
                  	  $scope.loggedInUserCountryName = $scope.profiles_data[i].countryName ;
                    }
                  }
                $scope.request.profileCountry = $scope.loggedInUserCountryName;
                $scope.request.country = $scope.loggedInUserCountryName;
                $scope.profile.country = $scope.loggedInUserCountryName;
                
              }).catch(function(){
              console.log('couldnt fetch user profiles');           	
              });
             
            }).catch(function(){
            console.log('couldnt fetch user profiles');
           	
            });
        	
        	
         	  
       
        };
        
        $scope.userProfileData();
       
        
        
        
        
       /* $scope.profile.profile_types = $scope.profile_types; */
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
        var profile_country_id = {};
        
        $scope.submit = function(request) {
        	$scope.responseOnSearch = '';
        	params =  request;
        	$scope.profile.country = request.country;        	
        	$scope.selectedids = [];
        	$scope.cntryValue = request.country;
       	
        	for(var i in $scope.counties){
                if ($scope.counties[i].name == request.profileCountry){
              	  collecting_country_id = $scope.counties[i].id;              
                }
                if ($scope.counties[i].name == request.country){
                	  profile_country_id = $scope.counties[i].id;              
                  }
              } 
        	
                ProfileSearch.get(params).$promise
                .then(function(profileSearch) {
                  $scope.profileSearch = profileSearch;
                  if($scope.search !== undefined){
                	  $scope.search = undefined;
                  }
                  $scope.isReset = true;
                 
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
            
           
           
            $scope.emaildetails = {};
            $scope.countryCopy = {};
            $scope.profile_type_id = {};
            $scope.countryReviwer = {};
            $scope.resultcopy = {};
            
            $scope.generateEmail = function(emaildetails){
            	EmailGeneration.save(emaildetails).$promise
            .then(function(response) {
                if(response.$promise.$$state.status == 1)
            	{
                	console.log(response);
                }
                else
                	{
                	console.log(response);
                	}
               
              });
    		};

            
        	$scope.getReviewerDetails = function(reqID){
        	  	 var  emailTo = 'emailTo';
       	    	 var  emailFrom = 'emailFrom';
       	    	 var  message = 'message';
       	    	 var  emailCC = 'emailCC';
       	    	 var  requestID = 'requestID';
       	    	 var  subject = 'subject';
       	    	 var emaildetails = {};
       	    	 var resultcontent = {};
       	    	 var fn = ($scope.resultcopy.firstName == null)? '' : $scope.resultcopy.firstName;
        		 var ln = ($scope.resultcopy.lastName == null)? '' : $scope.resultcopy.lastName;
        		 var on = ($scope.resultcopy.organizationName == null)? '' : $scope.resultcopy.organizationName;	        		    	
        		 var city = ($scope.resultcopy.city == null)? '' : $scope.resultcopy.city ;       		    	
        		 var notes = ($scope.resultcopy.notes == null)? '' : $scope.resultcopy.notes;
    		Review.query().$promise.then(function(result) {            	
    		if(result.$promise.$$state.status == 1){
    		resultcontent = result;
    		for(var i in result){
    			if(i != "$promise" && i != "$resolved"){
    			 if (result[i].countries.name == $scope.countryCopy){
                  	 $scope.countryReviwer = result[i].cntryReviewer;             
                    }
    			}
              }
    		$http.get('./emailproperties.json').then(function (response) {
    		  console.log(response);
    		     if( response.data.production.value === 'yes'){
    		    	 
    		    	 $scope.emaildetails[emailTo] = $scope.countryReviwer; 
    		    	 $scope.emaildetails[emailFrom] = $scope.logged_In_User.userName; 
    		     }
    		     else if(response.data.development.value === 'yes'){
    		    	 
    		    	$scope.emaildetails[emailTo] = response.data.development.emailTo;
    			    $scope.emaildetails[emailFrom] = response.data.development.emailFrom;
    		     }
    		     else if(response.data.testing.value === 'yes'){
    		    	 
    		    	$scope.emaildetails[emailTo] = response.data.testing.emailTo;
    			    $scope.emaildetails[emailFrom] = response.data.testing.emailFrom;
    		     }
    		     if(fn != ''){
    		     $scope.emaildetails[message] = "This is to inform you that the below profile creation request has been submitted for you to review.<br/>"+
    		    	"<br/>"+
    		    	"First Name: "+fn+"<br/>"+
    		    	"<br/>"+
    		    	"Last Name: "+ln+"<br/>"+
    		    	"<br/>"+
    		    	"Address: "+$scope.resultcopy.address+"<br/>"+
    		    	"<br/>"+
    		    	"City: "+city+ "<br/>"+
    		    	"<br/>"+
    		    	"Specility: "+$scope.resultcopy.specility+"<br/>"+
    		    	"<br/>"+
    		    	"Note for Reviewer: "+notes+"<br/>"+
    		    	
    		    	"<br/>"+
    		    	"Please review  the request and create an entry in TRS application. If the profile already exist, please map the TR ID in GCMS and proceed rejecting the request.<br/>"+
    		    	"<br/>"+
    		    	"Thanks and Regards<br/>"+
    		    	"GCMS Application Support<br/>"+
    		    	"<br/>"+
    		    	"<br/>"+
    		    	"This email was auto-generated by the GCMS System. Please do not reply to this email. If you need support with the GCMS Application, please raise a request for GCMS Support using the following Link<br/>";
    		         }
    		     else if(on != ''){
        		     $scope.emaildetails[message] = "To: "+$scope.countryReviwer+"<br/>"+
        		    	"CC: "+$scope.logged_In_User.userName+"<br/>"+
        		    	"<br/>"+
        		    	"This is to inform you that the below profile creation request has been submitted for you to review.<br/>"+
        		    	"<br/>"+
        		    	"Organization Name: "+on+"<br/>"+
        		    	"<br/>"+
        		    	"Address: "+$scope.resultcopy.address+"<br/>"+
        		    	"<br/>"+
        		    	"City: "+city+ "<br/>"+
        		    	"<br/>"+
        		    	"Specility: "+$scope.resultcopy.specility+"<br/>"+
        		    	"<br/>"+
        		    	"Note for Reviewer: "+notes+"<br/>"+
        		    	
        		    	"<br/>"+
        		    	"Please review  the request and create an entry in TRS application. If the profile already exist, please map the TR ID in GCMS and proceed rejecting the request.<br/>"+
        		    	"<br/>"+
        		    	"Thanks and Regards<br/>"+
        		    	"GCMS Application Support<br/>"+
        		    	"<br/>"+
        		    	"<br/>"+
        		    	"This email was auto-generated by the GCMS System. Please do not reply to this email. If you need support with the GCMS Application, please raise a request for GCMS Support using the following Link<br/>";
        		         }
    		        $scope.emaildetails[requestID] = reqID;
    		    	$scope.emaildetails[subject] = 'Request ID: '+reqID +' '+ $scope.profile_type_id +' Profile Review Request for '+$scope.countryCopy;
    		    	emaildetails = $scope.emaildetails;
    		    	$scope.generateEmail(emaildetails);
    		         });    			    	
    	 	      }
        	    });
        	  };
            
        
            
         $scope.create = function(item){   
        	 $scope.responseOnSave = '';
        	 $scope.responseOnUnsave = '';
        	 var request = item;
   	    	 var reqID = {};
   	 
  	    	IdentityRequest.save(request).$promise
              .then(function(result) {
                  if(result.$promise.$$state.status == 1)
              	{
                  	                	  
                  	reqID = result.id;
                  	$scope.countryCopy = result.country;
                  	$scope.profile_type_id = result.profileTypeId;
                  	$scope.resultcopy = result;
                  	$scope.getReviewerDetails(reqID);
                	$scope.responseOnSave = "Saved successfully";
                  	item.firstName = '';
                  	item.profileTypeId = '';
                  	item.lastName = '';
                  	item.organizationName = '';
                  	item.city = '';
                  	item.country = '';
                  	item.specility = '';
                  	item.address = '';
                  	item.notes = '';
                  	
                  	}
                 
                }).catch(function(){
             	  
                	$scope.responseOnUnsave = "Unable to save record"; 
              	   
              	   
                }); 
          };
             
      	   
      
          $scope.list = function(){
        	  var selid = 'selid';
        	  var selectedParams = 'selectedParams';
        	  var collectingCtry = 'collectingCtry';
        	  $scope.dataToSend = {checkedIds :{},templates :{}};
        	  
              ids[selid] =  {checked: JSON.stringify($scope.selectedids)};
              ids[selectedParams] = {selection: JSON.stringify(params)}
              ids[collectingCtry] = collecting_country_id;
              ids['profileCountry'] = profile_country_id;
           myService.set(ids);
           $scope.id = myService.get();
        	 $scope.checkedIds = $scope.id.selid.checked;
        	 $scope.checkedIds = JSON.parse($scope.checkedIds);
        	 $scope.cntryValue = $scope.id.selectedParams.selection;
        	 $scope.searchCriteria = JSON.parse($scope.cntryValue);
        	 $scope.cntryValue = $scope.searchCriteria.country;
        	$scope.dataToSend.checkedIds = $scope.checkedIds;
        	$scope.dataToSend.templates = $scope.templates;
        	
          };
                               
          //********************************
      	console.log('id'+$scope.id)
          
          $scope.generateConsentAnnex = {};
          $scope.id = [];  
          $scope.checked = [];
          $scope.cntry = {};  
          $scope.filterTempalates = [];
          $scope.templId = {};
          
          var profileData = {};
         
          
          
         
            
            
            
            var updateTemplates = function(result){
                $scope.templates = result; 
                console.log('templates' +result);             
                $scope.dataToSend.templates = $scope.templates;
              };     
              
              $scope.customArrayFilter = function (result) {
            	$scope.id = myService.get();
             	 $scope.checkedIds = $scope.id.selid.checked;
             	 $scope.checkedIds = JSON.parse($scope.checkedIds);
             	 $scope.cntryValue = $scope.id.selectedParams.selection;
             	 $scope.searchCriteria = JSON.parse($scope.cntryValue);
             	 $scope.cntryValue = $scope.searchCriteria.country;             	 
             	/*$scope.dataToSend.checkedIds = $scope.checkedIds;*/
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
                                
        
              
                
            
             
 				
				$scope.submittry = function(item){ 
					console.log($scope.checkedIds);
					$scope.msg = '';
					$scope.responseOnUnsave = '';
					var values = $scope.checkedIds;               	 
					var modifiedparams = {};
					$scope.created = false;
					
				
					 $scope.getPDFs = function(modifiedparams,y){
						 return ConsentAnnex.save(modifiedparams).$promise.then(function(result) {
		                       if(result.$promise.$$state.status == 1)
		                   	{
		                    	   console.log(result);		                    	
		                               y++;
		                               $scope.createTask(y);		                    	
		                   	$scope.msg = "You can see the generated PDF in your Downloads folder";
		                   
		                   	
		                   	}
		                  
		                 }).catch(function(){
		               	  $scope.responseOnUnsave = "Unable to generate PDF";
		                 });
					};
					  
					$scope.downloadAsZip = function(){
						var link = 'http://localhost:8080/gcms-service/consent-annex-pdf/consentFilesZip.zip';
                 	   $http({method: 'GET',url: link,responseType: 'arraybuffer'}).then(function (response) {
                 		   console.log(response);
                 		   var bin = new Blob([response.data]);
                            var docName = 'consentFilesZip.zip';           
                            saveAs(bin, docName);                        							
	                    	   });
					}
					
					var y = 0;
					$scope.createTask = function(y){
						if(y<$scope.checkedIds.length){
					var currentId = values[y].id; 	
					
				
					modifiedparams['payercountry'] = {id: JSON.stringify($scope.id.profileCountry)};
					modifiedparams['profilecountry'] = {id: JSON.stringify($scope.id.collectingCtry)};
					modifiedparams['profileType'] = $scope.searchCriteria.profileType;
					modifiedparams['bpid'] = {id: currentId};
					modifiedparams['tmpl_id'] = {id: JSON.stringify(item.request[currentId].tmpl_id)};
					modifiedparams['eventname'] = item.request[currentId].eventname;
					modifiedparams['pocode'] = item.request[currentId].pocode;
					modifiedparams['acmcode'] = item.request[currentId].acmcode;
					console.log(modifiedparams);
					$scope.getPDFs(modifiedparams,y);
				  	
						}
						else
							{
							$scope.downloadAsZip();
							return;
							}
						
					};
					
					if(y==0){
					$scope.createTask(y);
					}
					
				
					
				};

          
          $scope.submitid = function(id) {
     		 
              $state.go('profile-detail-view', {id} );
            };
          
       
    }
})();
