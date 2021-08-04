/**
 * @ngdoc overview
 * @name gcms.profile.ProfileListCtrl
 *
 * @requires gcms.profile
 *
 * @description Controller: Handles Home, Creates Missing Profile , Generate Consent Annex modules.
 * 
 * @param ProfileSearch,$scope,$http,$stateParams,$state,myService,Templates,Country,IdentityRequest,Review,EmailGeneration,UserProfile,LoggedUserDetail,ConsentAnnex,ctrl,ConsentAnnexPdf
 */

(function () {

	'use strict';

	angular
	.module('gcms.profile')
	.filter('SearchFilter', function($filter){
		    return function(input, predicate){
		    	var fn=[];		    			    			    			    	   		    		    			    	 		    
		    	var keys = Object.keys(predicate);
		    	var y=0;
		    	var patternStr = '';		    			    	
		    	
		    	var patternlastName = (typeof predicate.lastName == "string") ? predicate.lastName.replace("%",".*") : predicate.lastName;
		    	var patternfirstName = (typeof predicate.firstName == "string") ? predicate.firstName.replace("%",".*") : predicate.firstName;
		    	var patternorganisationName = (typeof predicate.organisationName == "string") ? predicate.organisationName.replace("%",".*") : predicate.organisationName;
		    	var patterncity = (typeof predicate.city == "string") ? predicate.city.replace("%",".*") : predicate.city;
		    	var patternaddress = (typeof predicate.address == "string") ? predicate.address.replace("%",".*") : predicate.address;
		    	var patternspeciality = (typeof predicate.speciality == "string") ? predicate.speciality.replace("%",".*") : predicate.speciality;
		    	var patternid =  (typeof predicate.id == "string") ? predicate.id.replace("%",".*") : predicate.id;
		    	
		    	if(keys.length != 0){		   
		    			    
						var lastName = new RegExp(patternlastName, 'gi');
						var firstName = new RegExp(patternfirstName, 'gi');
						var organisationName = new RegExp(patternorganisationName, 'gi');
						var city = new RegExp(patterncity, 'gi');
						var address = new RegExp(patternaddress, 'gi');
						var speciality = new RegExp(patternspeciality, 'gi');
						var id = new RegExp(patternid, 'gi');
						for(var i in input){							
							if (lastName.exec(input[i].lastName) != null && firstName.exec(input[i].firstName) != null && organisationName.exec(input[i].organisationName) != null && city.exec(input[i].city) != null && address.exec(input[i].address) != null && speciality.exec(input[i].speciality) != null && id.exec(input[i].id) != null){
								lastName.lastIndex = 0;
								firstName.lastIndex = 0;
								organisationName.lastIndex = 0;
								city.lastIndex = 0;
								address.lastIndex = 0;
								speciality.lastIndex = 0;
								id.lastIndex = 0;
								fn.push(input[i]);																	
							}
							}
						
		    		return fn;
				    	}
		    	else{
		    		return input;
		    	}		        
		    }	
		})
	.controller('ProfileListCtrl', ProfileSearch);

	ProfileSearch.$inject = ['ProfileSearch','$scope','$http','myService','Templates','Country','IdentityRequest','Review','UIConfig','EmailGeneration','UserProfile','LoggedUserDetail','ConsentAnnex','ConsentAnnexView','ConsentAnnexPdf','$rootScope','toasty','ngDialog','ValidatedCode','Credential'];

	function ProfileSearch(ProfileSearch,$scope,$http,myService,Templates,Country,IdentityRequest,Review,UIConfig,EmailGeneration,UserProfile,LoggedUserDetail,ConsentAnnex,ConsentAnnexView,ConsentAnnexPdf,$rootScope,toasty,ngDialog,ValidatedCode,Credential) {

		var params = {};
		console.log("Inside Profile.list.controller");
		$scope.orderByField = 'firstName';
		$scope.reverseSort = false;
		$scope.selectedids = [];  
		$scope.itemsByPage=20;
		$scope.dataToSend = {checkedIds :{},templates :{}};
		var ids = [];
		var index;
		var criteria = {};
		$scope.alerts = [];
		$scope.profile = {};
		$scope.request = {};
		var collecting_country_id = {};
		var profile_country_id = {};
		$scope.setDownload = true;
		$scope.id = [];                
		$scope.templId = {};
		$scope.readOnlyCC = false;
		$scope.profileFiler = false;
		$scope.readOnlyPC = false;
		$scope.request.profileType = 'HCP';	
		$scope.request.CCID = '';
		$scope.request.NIT = '';
		$scope.profile.readOnly = false;
		$scope.hideHCO = true;
		$scope.crossInCountry = {};
		$scope.profileTypeSelected = {};
		$scope.templateTypeSelected = {};	
		$scope.clearText = "";
		$scope.sysAdmin = false;		
		$scope.sysAdminCCID = false;
		$scope.sysAdminNIT = false;
		$scope.profile_types = [{
			name: 'HCP',
			value: 'HCP'
		},   {
			name: 'HCO',
			value: 'HCO'
		}];
		 var ctrl = this;
		 var internalError = function(){
		        toasty.error({
		          title: 'Error',
		          msg: 'Internal Server Error!',
		          showClose: true,
		          clickToClose: true,
		          timeout: 5000,
		          sound: false,
		          html: false,
		          shake: false,
		          theme: 'bootstrap'
		        });
		      };
		      var unspecifiedError = function(){
		          toasty.error({
		            title: 'Error',
		            msg: 'Unspecified error!',
		            showClose: true,
		            clickToClose: true,
		            timeout: 5000,
		            sound: false,
		            html: false,
		            shake: false,
		            theme: 'bootstrap'
		          });
		        };
		        var success = function(){ 
		        toasty.success({
        	        title: 'Success',
        	        msg: 'Success !',
        	        showClose: true,
        	        clickToClose: true,
        	        timeout: 5000,
        	        sound: false,
        	        html: false,
        	        shake: false,
        	        theme: 'bootstrap'
        	      });
		        };
		        
		        var successTempProfile = function(){ 
			        toasty.success({
	        	        title: 'Success',
	        	        msg: 'Temporary Profile created successfully, you may generate Consent Annex now!',
	        	        showClose: true,
	        	        clickToClose: true,
	        	        timeout: 30000,
	        	        sound: false,
	        	        html: false,
	        	        shake: false,
	        	        theme: 'bootstrap'
	        	      });
			        };
		       	
		        UIConfig.query().$promise.then(function(result){
		        	$scope.configFile = result;
		        });
		        
		        $scope.HOME_PAY_CNTRY_MSG = {
		        		  "title": "Title",
		        		  "content": "Here you can select the Paying Country for this interaction. It is important to know the paying country because this is the way we determine between local interactions and cross-border interactions."
        		};
		        
		        $scope.HOME_REP_CNTRY_MSG = {
		        		  "title": "Title",
		        		  "content": "Here you choose the Reporting Country. This is the HCP or HCO Country. Application will search in this location for HCPs or HCOs."
        		};
		        
		        $scope.HOME_PROFILE_TYP_MSG = {
		        		  "title": "Title",
		        		  "content": "Here you select the profile type. HCP is for Healthcare Professionals (doctors, residents, etc.) and HCO is for Healthcare Organizations (hospitals, universities, private practice companies, etc.)."
        		};
		        
		        $scope.HOME_FRS_NM_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the first name of the HCP here. If it is an Organization, leave it empty. The system will search using partial criteria too. For example, if you are looking for -John-, entering -jo- will bring all the names that contains -jo-. The system is not case sensitive."
        		};
		       
		        
		        $scope.HOME_LST_NM_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the Last Name of the HCP or Organization name here. The system will search using partial criteria too. For example, if you are looking for -John-, entering -jo- will bring all the names that contains -jo-. The system is not case sensitive."
        		};
		        
		        $scope.HOME_PROFILE_CITY_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the HCP or HCO City here. The system will search using partial criteria too. For example, if you are looking for -Berlin-, entering -be- will bring all the profiles where their Cities contains -be-. The system is not case sensitive."
        		};
		        
		        $scope.HOME_PROFILE_SPEC_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the HCP Specialty here. If it is an Organization, leave it empty. The specialties are usually written in the language of the HCP/HCO nationality. If you do not know exactly the name of specialty, leave it empty. The system will search using partial criteria too. For example, if you are looking for -Cardiology-, entering -ca- will bring all the profiles with specialties that contains -ca-. The system is not case sensitive."
		        };
		        
		        $scope.HOME_TEMPLATE_TYPE_MSG = {
		        		  "title": "Title",
		        		  "content": "Select the Consent Template here. This list is dynamically populated based on your Reporting Country Selections."
		        		};
		       
		        $scope.HOME_ADDRESS_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the HCP or HCO Address here. The system will search using partial criteria too. For example, if you are looking for -GNEISENAUSTRASSE 5-, entering -GNE- will bring all the profiles where their Addresses contains -GNE-. The system is not case sensitive."
        		};
		        	
		        $scope.CCID_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the CCID here. If you do not know exactly the CCID, leave it empty. The system will search using partial criteria too. The system is not case sensitive."
		        };
		        
		        $scope.NIT_MSG = {
		        		  "title": "Title",
		        		  "content": "Enter the NIT here. If you do not know exactly the NIT, leave it empty. The system will search using partial criteria too. The system is not case sensitive."
		        };

		        
		//Getting Logged in User Profile
				
		        $scope.userProfileData = function(){		        	
					var currentprofile = $rootScope.currentProfile;
					
					$scope.loggedInUserCountry = currentprofile.countryId;
					$scope.loggedInUserCountryName = currentprofile.countryName ;
					$scope.loggedInUserCountryCode = currentprofile.isoCode;
					$scope.loggedInUserRegionId = currentprofile.regionId ;
					$scope.loggedInUserRole = currentprofile.roleId;
					$scope.logged_In_User= currentprofile.userName;
					$scope.fullName = currentprofile.firstName+" "+currentprofile.lastName;
					
					if($scope.loggedInUserRole == 5){
						$scope.sysAdmin = true;
					}
					
					if($scope.loggedInUserRegionId == 5 && $scope.request.profileType == 'HCP' ){
						$scope.profileFiler = true;
						$scope.sysAdminCCID = true;
					}	
					
					if ($scope.loggedInUserRole == 2 || $scope.loggedInUserRole == 3 ){	
						 $scope.request.collectingCountry = $scope.loggedInUserCountryName;
						 $scope.request.country = $scope.loggedInUserCountryName;
						 $scope.request.regionId = $scope.loggedInUserRegionId;
						 $scope.readOnlyCC = true;
						 $scope.readOnlyPC = true;
					}
					else if ($scope.loggedInUserRole == 1 || $scope.loggedInUserRole == 4 || $scope.loggedInUserRole == 5)
					{	
						 $scope.request.collectingCountry = $scope.loggedInUserCountryName;
						 $scope.request.regionId = $scope.loggedInUserRegionId;
						 //$scope.readOnlyCC = true;
					}											               
		};
				
		
		
		$scope.compare = function(){	
			$scope.request.tmpl_id = $scope.clearText;
			$scope.request.regionId = $scope.loggedInUserRegionId;
			$scope.profileFiler = false;
			$scope.sysAdminNIT = $scope.clearText;
			$scope.sysAdminCCID = $scope.clearText;
			$scope.setDownload = ($scope.selectedids.length == 0 || $scope.request.tmpl_id == undefined || $scope.request.tmpl_id == "" ) ? true : false;
			if(($scope.request.country == 'COLOMBIA' && $scope.request.collectingCountry == 'COLOMBIA') && $scope.request.profileType == 'HCO' ){
				$scope.request.regionId = 5;
				$scope.profileFiler = true;
				$scope.sysAdminNIT = true;
				$scope.sysAdminCCID = false;

			}
			
			if(($scope.request.country == 'COLOMBIA' && $scope.request.collectingCountry == 'COLOMBIA') && $scope.request.profileType == 'HCP' ){
				$scope.sysAdminNIT = false;
				$scope.sysAdminCCID = true;
				$scope.request.regionId = 5;
				$scope.profileFiler = true;

			}
			if(($scope.request.collectingCountry == $scope.request.country) && $scope.loggedInUserRole == 1){				
				$http.get('./emailproperties.json').then(function (response) {
				$scope.str =  response.data.countryinfo.msg;
				$scope.str = $scope.str.replace("PC",$scope.request.collectingCountry);
				$scope.str = $scope.str.replace("RC",$scope.request.country);
				ngDialog.open({ template:"<html><body><div class=\"dialog-contents row\" style=\"margin-right: 0px;margin-left: 0px;\"><p style=\"font-family:Calibri\" >"+
				$scope.str+ "</p>"+
			    "<div style=\"float:right;\"><button ng-click=\"closeThisDialog()\" style=\"padding-left: 10px; padding-right: 10px;font-family:calibri;color: #fff;background-color: #337ab7;border-color: #337ab7;\">OK</button></div> </div></body></html>" , plain: true ,showClose: true});
				});
			}
		};
			
		
		//Called on create missing profile to sent country and lock 
		$scope.passCountryName = function (){
			if($scope.request.country != undefined){
			$scope.profile.country = $scope.request.country;
			$scope.profile.readOnly = true;
			}
			else
				{
				$scope.profile.msg = "Please select Reporting Country to auto populate Profile Country"
				$scope.profile.readOnly = true;
				}
		};
		
		
		//Calling $scope.userProfileData() to get Logged in User Profile Data
		$scope.userProfileData();

		//Loading Paying Country for Global
		
		
		//Loading Countries
		var updateCountry = function(result){
			$scope.counties = result;         
		};

		var loadCountry = function(){
			$scope.counties = [];
			$scope.counties = $rootScope.countries;
			/*Country.query().$promise.then(updateCountry);*/
		};

		loadCountry();

		$scope.$on('$localeChangeSuccess', loadCountry);
		
		var updateCredential = function(result){
  			$scope.credential = result;
  		};
  		
		var loadCredential = function(profType){
			$scope.credential = [];
	  		Credential.query({id : $scope.loggedInUserCountry,partyType : profType}).$promise.then(updateCredential);
	  			
	  	};
	  		
	  	$scope.clear = function()
		{
			$scope.request.lastName = $scope.clearText;
			$scope.request.city = $scope.clearText;
			$scope.request.firstName = $scope.clearText;
			$scope.request.address = $scope.clearText;
			$scope.request.tmpl_id = $scope.clearText;
			$scope.request.speciality = $scope.clearText;
			$scope.request.uniqueTypeId = $scope.clearText;
			$scope.request.uniqueTypeCode = $scope.clearText;
			$scope.sysAdminNIT = $scope.clearText;
			$scope.sysAdminCCID = $scope.clearText;
			$scope.setDownload = ($scope.selectedids.length == 0 || $scope.request.tmpl_id == undefined || $scope.request.tmpl_id == "" ) ? true : false;
			
			if(($scope.request.country == 'COLOMBIA' && $scope.request.collectingCountry == 'COLOMBIA') && $scope.request.profileType == 'HCO' ){
				$scope.sysAdminNIT = true;
				$scope.sysAdminCCID = false;
			}
			
			if(($scope.request.country == 'COLOMBIA' && $scope.request.collectingCountry == 'COLOMBIA') && $scope.request.profileType == 'HCP' ){
				$scope.sysAdminNIT = false;
				$scope.sysAdminCCID = true;
			}
		};				
		
		//Function to search for requested profiles
		$scope.submit = function(request) {
			$scope.responseOnSearch = '';			
			params =  request;
			$scope.profile.country = request.country;        	
			$scope.selectedids = [];
			$scope.cntryValue = request.country;
			//R2.0 - arunkv - for time being using isTempProfile as tempProfile attribute, need to add this in bus profile
			var data = {"country":"","profileType":"","lastName":"","city":"","firstName":"","address":"","collectingCountry":"","speciality":"","uniqueTypeCode":"","uniqueTypeId":"","isTempProfile":"","regionId":"","credential":""};
			/*if($scope.request.profileType == 'HCP'){
				$scope.hideHCO = true;
				$scope.hideHCP = false;
			}else if($scope.request.profileType == 'HCO'){
				$scope.hideHCP = true;
				$scope.hideHCO = false;
			}*/

			for(var i in $scope.counties){
				if ($scope.counties[i].name == request.collectingCountry){
					collecting_country_id = $scope.counties[i].id;              
				}
				if ($scope.counties[i].name == request.country){
					profile_country_id = $scope.counties[i].id;              
				}
			} 
			data.country = params.country;
			data.profileType = params.profileType;
			data.lastName = (params.lastName !== undefined && params.lastName !== "" ) ? params.lastName : 'lastName';
			data.city = (params.city !== undefined && params.city !== "") ? params.city : 'city';
			data.firstName = (params.firstName !== undefined && params.firstName !== "") ? params.firstName : 'firstName';
			data.address = (params.address !== undefined && params.address !== "" ) ? params.address : 'address';
			if(data.profileType == 'HCP' && data.country == 'COLOMBIA'){
				data.uniqueTypeCode = 'CCID';
			}
			if(data.profileType == 'HCO' && data.country == 'COLOMBIA'){
				data.uniqueTypeCode = 'NIT';
			}
			data.speciality = (params.speciality !== undefined && params.speciality !== "") ? params.speciality : 'speciality';
			data.uniqueTypeId = (params.uniqueTypeId !== undefined && params.uniqueTypeId !== "") ? params.uniqueTypeId : 'uniqueTypeId';
			data.collectingCountry = params.collectingCountry;
			data.regionId = $scope.request.regionId;
			data.credential = $scope.request.credential;
			ProfileSearch.get({
				country : data.country,
				profileType : data.profileType,
				lastName : data.lastName,
				city : data.city,
				firstName : data.firstName,
				address : data.address,
				speciality : data.speciality,
				uniqueTypeCode  : data.uniqueTypeCode,
				uniqueTypeId : data.uniqueTypeId,
				regionId : data.regionId,
				credential : data.credential
			}).$promise
			.then(function(profileSearch) {
				$scope.profileSearch = profileSearch;				
				/*if($scope.search !== undefined){
					$scope.search = undefined;
				}*/
				$scope.isReset = true;
				if($scope.request.profileType == 'HCP'){
					$scope.hideHCO = true;
					$scope.hideHCP = false;
				}else if($scope.request.profileType == 'HCO'){
					$scope.hideHCP = true;
					$scope.hideHCO = false;
				}
				
				// show Credentials in Search results only for Colombia
				if($scope.loggedInUserCountry == 2046)
					$scope.hideCredential = false;
				else
					$scope.hideCredential = true;

			}).catch(function(){
				$scope.responseOnSearch = "No records to show"
				$scope.profileSearch.length = 0;
				$scope.profileSearchCopy.length = 0;                               	
			});                       
		};       

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
					index = $scope.selectedids.indexOf(item);
					$scope.selectedids.splice(index,1);

				}
			});
			$scope.setDownload = ($scope.selectedids.length == 0 || $scope.request.tmpl_id == undefined || $scope.request.tmpl_id == "" ) ? true : false;
			if ((unchecked == 0) || (checked == 0)) {
				$scope.checkboxes.checked = (checked == total);
			}
			// grayed check box
			angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
		}, true);


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
					console.log("Yes");
				}
				else
				{
					console.log("No");
				}

			});
		};

		//Gets reviewer data and generates email 
		$scope.getReviewerDetails = function(reqID){
			var  emailTo = 'emailTo';
			var  emailFrom = 'emailFrom';
			var  message = 'message';
			var  emailCC = 'emailCC';
			var  requestID = 'requestID';
			var  subject = 'subject';
			var emaildetails = {};
			var result = {};
			var fn = ($scope.resultcopy.firstName == null)? '' : $scope.resultcopy.firstName;
			var ln = ($scope.resultcopy.lastName == null)? '' : $scope.resultcopy.lastName;
			var on = ($scope.resultcopy.organizationName == null)? '' : $scope.resultcopy.organizationName;	        		    	
			var city = ($scope.resultcopy.city == null)? '' : $scope.resultcopy.city ;       		    	
			var notes = ($scope.resultcopy.notes == null)? '' : $scope.resultcopy.notes;
			
					
				result = $rootScope.reviewers;
					for(var i in result){
						if(i != "$promise" && i != "$resolved"){
							if (result[i].countries.name == $scope.countryCopy){
								$scope.countryReviwer = result[i].cntryReviewer;             
							}
						}
					}

						if( $scope.configFile.emailTo != ""){
							$scope.emaildetails[emailTo] = $scope.configFile.emailTo; 
							$scope.emaildetails[emailFrom] = $scope.configFile.emailFrom; 
						}
						else {
							$scope.emaildetails[emailTo] = $scope.countryReviwer;
							$scope.emaildetails[emailFrom] = $scope.configFile.emailFrom;
						}
						if(fn != ''){
							$scope.msgHCP = $scope.configFile.msgHcp;
							$scope.msgHCP = $scope.msgHCP.replace(new RegExp("REQUESTOR_FULL_NAME", 'g'),$scope.fullName);
							$scope.msgHCP = $scope.msgHCP.replace(new RegExp("PROFILE_TYPE", 'g'),$scope.profile_type_id);
							$scope.msgHCP = $scope.msgHCP.replace("PROFILE_FIRST_NAME",fn);
							$scope.msgHCP = $scope.msgHCP.replace("PROFILE_LAST_NAME",ln);
							$scope.msgHCP = $scope.msgHCP.replace("PROFILE_SPECIALTY",$scope.resultcopy.specility);
							$scope.msgHCP = $scope.msgHCP.replace("PROFILE_CITY",city);
							$scope.msgHCP = $scope.msgHCP.replace("NOTE_FOR_REVIEWER",notes);
							$scope.msgHCP = $scope.msgHCP.replace(new RegExp("PROFILE_CNTRY", 'g'),$scope.countryCopy);
							$scope.msgHCP = $scope.msgHCP.replace("PROFILE_ADDRESS",$scope.resultcopy.address);
							$scope.msgHCP = $scope.msgHCP.replace("COUNTRY_REVIEWER",$scope.countryReviwer);
							
							$scope.emaildetails[message] = $scope.msgHCP;
						}
						else if(on != ''){
							$scope.msgHCO = $scope.configFile.msgHco;
							$scope.msgHCO = $scope.msgHCO.replace(new RegExp("REQUESTOR_FULL_NAME", 'g'),$scope.fullName);
							$scope.msgHCO = $scope.msgHCO.replace(new RegExp("PROFILE_TYPE", 'g'),$scope.profile_type_id);
							$scope.msgHCO = $scope.msgHCO.replace("ORG_NAME",on);						
							$scope.msgHCO = $scope.msgHCO.replace("PROFILE_SPECIALTY",$scope.resultcopy.specility);
							$scope.msgHCO = $scope.msgHCO.replace("PROFILE_CITY",city);
							$scope.msgHCO = $scope.msgHCO.replace("NOTE_FOR_REVIEWER",notes);
							$scope.msgHCO = $scope.msgHCO.replace(new RegExp("PROFILE_CNTRY", 'g'),$scope.countryCopy);
							$scope.msgHCO = $scope.msgHCO.replace("PROFILE_ADDRESS",$scope.resultcopy.address);
							$scope.msgHCO = $scope.msgHCO.replace("COUNTRY_REVIEWER",$scope.countryReviwer);
							
							$scope.emaildetails[message] = $scope.msgHCO;
						}
						$scope.emaildetails[requestID] = $scope.countryReviwer;
						$scope.emaildetails[subject] = "GCMS - "+$scope.profile_type_id+" Profile Review Request for "+$scope.countryCopy;						
						emaildetails = $scope.emaildetails;
						$scope.generateEmail(emaildetails);					    			    	
				
		};
		
		//Create missing profile : Empty First/Last/Org name text box based on the profile type selection
		// refresh the Credentials dropdown
		$scope.resetForm = function(item){
			$scope.validationCCID = '';
			$scope.validationNIT = '';
			if(item.profileTypeId.Name == 'HCP'){
				item.organizationName = '';
				$scope.uniqueTypeCodeNIT = '';
			}
			else if(item.profileTypeId.Name == 'HCO'){
				item.firstName = '';
				item.lastName = '';				
				$scope.uniqueTypeCodeCCID = '';
			}	
			
			loadCredential(item.profileTypeId.Name);
		};
		
		//Creates the missing profile 
		$scope.create = function(item){   
			$scope.responseOnSave = '';
			$scope.responseOnUnsave = '';
			var request = item;
			var reqID = {};
			request.profileTypeId = item.profileTypeId.Name;
			request.status = 'Pending';
			delete request.readOnly;
			delete request.msg;
			IdentityRequest.save(request).$promise
			.then(function(result) {
				if(result.$promise.$$state.status == 1)
				{

					reqID = result.id;
					$scope.countryCopy = result.country;
					$scope.profile_type_id = result.profileTypeId;
					$scope.resultcopy = result;
					//Gets Reviewer Details and sends out email to respected Reviewer on save of the requested data
					$scope.getReviewerDetails(reqID);					
					success();
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
				
				internalError();


			}); 
		};
		
		//Creates the temporary profile capable of getting consent 
		$scope.createTempProfile = function(item){   
			$scope.responseOnSave = '';
			$scope.responseOnUnsave = '';
			item.regionId = 5;
			item.uniqueTypeCodeForNIT = $rootScope.NIT;
			item.uniqueTypeCodeForCCID = $rootScope.CCID;
			var request = item;
			var reqID = {};
			request.profileTypeId = item.profileTypeId.Name;
			request.status = 'Pending';
			delete request.readOnly;
			delete request.msg;
			IdentityRequest.save(request).$promise
			.then(function(result) {
				if(result.$promise.$$state.status == 1)
				{

					reqID = result.id;
					$scope.countryCopy = result.country;
					$scope.profile_type_id = result.profileTypeId;
					$scope.resultcopy = result;
					//Gets Reviewer Details and sends out email to respected Reviewer on save of the requested data
					$scope.getReviewerDetails(reqID);					
					successTempProfile();
					item.firstName = '';
					item.profileTypeId = '';
					item.uniqueTypeCodeForNIT = '';
					item.uniqueTypeCodeForCCID = '';
					item.lastName = '';
					item.organizationName = '';
					item.city = '';
					item.country = '';
					item.specility = '';
					item.address = '';
					item.notes = '';
					item.regionId = '';

				}

			}).catch(function(){
				
				internalError();


			}); 
		};

		//Collects the checked profile id's and related info
		$scope.templateDate = {};
		$scope.list = function(){ 
			$scope.currentYear = new Date();
			$scope.dataToSend = {checkedIds :{},templates :{},request : {}};

			ids['selid'] =  {checked: JSON.stringify($scope.selectedids)};
			ids['selectedParams'] = {selection: JSON.stringify(params)};
			ids['collectingCtry'] = collecting_country_id;
			ids['profileCountry'] = profile_country_id;
			ids['regionId'] = {regId: $scope.request.regionId};
			myService.set(ids);
			$scope.id = myService.get();
			$scope.checkedIds = $scope.id.selid.checked;
			$scope.checkedIds = JSON.parse($scope.checkedIds);
			$scope.cntryValue = $scope.id.selectedParams.selection;
			$scope.regionIdSelection = $scope.id.regionId.regId;
			$scope.searchCriteria = JSON.parse($scope.cntryValue);
			$scope.cntryValue = $scope.searchCriteria.country;
			$scope.dataToSend.checkedIds = $scope.checkedIds;
			$scope.dataToSend.templates = $scope.templates;
			$scope.currentYear = (new Date()).getFullYear();
			
			for(var i in $scope.templates){
				if($scope.templates[i].id == $scope.request.tmpl_id){							
					$scope.daterange = $scope.templates[i].dates_rages;
					$scope.templateDate['validity_start_date'] = $scope.templates[i].validity_start_date;
					$scope.templateDate['validity_end_date'] = $scope.templates[i].validity_end_date;
					if($scope.daterange == 'Y' ){
						$scope.dataToSend.setDates = false;
					}
					else
					{
						$scope.dataToSend.setDates = true;
					}
			}
			}
			/*if($scope.templateDate.validity_start_date != null && $scope.templateDate.validity_end_date != null){
				$scope.templateDate['start_year'] = $scope.templateDate.validity_start_date.substring(0,4);
				$scope.templateDate['start_month'] = $scope.templateDate.validity_start_date.substring(5,7);
				$scope.templateDate['start_day']= $scope.templateDate.validity_start_date.substring(8,10);
				
				$scope.templateDate['end_year'] = $scope.templateDate.validity_end_date.substring(0,4);
				$scope.templateDate['end_month'] = $scope.templateDate.validity_end_date.substring(5,7);
				$scope.templateDate['end_day']= $scope.templateDate.validity_end_date.substring(8,10);
				}*/
				
				for(var i  in $scope.checkedIds){
					$scope.dataToSend.request[$scope.checkedIds[i].id] = {"acmcode" : "","eventname" : "","pocode" : "","tmpl_id" : "","consentstartdate" : "","consentenddate" : "","eventEndDate": ""};
					if($scope.templateDate.validity_start_date != null && $scope.templateDate.validity_end_date != null){
					$scope.dataToSend.request[$scope.checkedIds[i].id].consentstartdate = moment.tz(moment($scope.templateDate.validity_start_date,'YYYY-MM-DD'),moment.tz.guess()) ;
					$scope.dataToSend.request[$scope.checkedIds[i].id].consentenddate = moment.tz(moment($scope.templateDate.validity_end_date,'YYYY-MM-DD'),moment.tz.guess()) ;
					}				
				}
		

		};

		//Copy to selected
		$scope.copy = function(item,copy){
			$scope.copyCheckedIds = [];
			$scope.currentYear = (new Date()).getFullYear();
			for(var i  in $scope.item.checkedIds){
				if(item.checkbox[$scope.item.checkedIds[i].id] == true){
					$scope.copyCheckedIds.push($scope.item.checkedIds[i].id);
				}
			}
			 				
			for(var i  in $scope.copyCheckedIds){
				item.request[$scope.copyCheckedIds[i]].acmcode = copy.acmcode; 
				item.request[$scope.copyCheckedIds[i]].eventname = copy.eventname;
				item.request[$scope.copyCheckedIds[i]].pocode = copy.pocode;
				if(copy.eventEndDate != undefined && copy.eventEndDate != ""){
				item.request[$scope.copyCheckedIds[i]].eventEndDate = copy.eventEndDate.clone();
				}
				if(copy.consentstartdate != undefined && copy.consentstartdate != ""){
				//item.request[$scope.copyCheckedIds[i]].consentstartdate = copy.consentstartdate.clone() == undefined? moment.tz($scope.templateDate.start_year+'/'+$scope.templateDate.start_month+'/'+$scope.templateDate.start_day,moment.tz.guess()) : copy.consentstartdate.clone();
				item.request[$scope.copyCheckedIds[i]].consentstartdate = copy.consentstartdate.clone() == undefined? moment.tz(moment($scope.templateDate.validity_start_date,'YYYY-MM-DD'),moment.tz.guess()) : copy.consentstartdate.clone();
				}
				if(copy.consentstartdate != undefined && copy.consentstartdate != ""){
				//item.request[$scope.copyCheckedIds[i]].consentenddate = copy.consentenddate.clone() == undefined? moment.tz($scope.templateDate.end_year+'/'+$scope.templateDate.end_month+'/'+$scope.templateDate.end_day,moment.tz.guess()) : copy.consentenddate.clone();
				item.request[$scope.copyCheckedIds[i]].consentenddate = copy.consentenddate.clone() == undefined? moment.tz(moment($scope.templateDate.validity_end_date,'YYYY-MM-DD'),moment.tz.guess()) : copy.consentenddate.clone();
				}
				
			}
		}
		
		//Loads all templates 
		var updateTemplates = function(result){
			$scope.templates = result;             
			$scope.dataToSend.templates = $scope.templates;
			$rootScope.template = $scope.templates;
		};

		//Filter on Template
		$scope.templateFilter = function (result){
			$scope.crossInCountry = $scope.request.collectingCountry==$scope.request.country? 'InCountry' : 'CrossBorder';
			$scope.profileTypeSelected = $scope.request.profileType;
			$scope.templateTypeSelected = $scope.crossInCountry+'-'+$scope.profileTypeSelected;					
			
			return ((result.cntry_id.name == $scope.request.country) && (result.tmpl_status == "ACTIVE") && (result.tmpl_type == $scope.templateTypeSelected ) && result.tmpl_location != null);
		}
				
		
		$scope.change = function(){			
			$scope.setDownload = ($scope.selectedids.length == 0 || $scope.request.tmpl_id == undefined || $scope.request.tmpl_id == "" ) ? true : false;
		};
		
		//Filters templates based on Reporting Country				
		$scope.efpiaFilter = function(countries){
			return (countries.efpiaCntryFlag == 'Y');
			
		};

		var loadTemplates = function(){
			$scope.templates = [];
			Templates.query().$promise.then(updateTemplates);
		};

		loadTemplates();
		
		$scope.$on('$localeChangeSuccess', loadTemplates);

		$scope.update = function(item) {
			$scope.templates = item;
			$rootScope.templates = item;
		};
		
		
	
		//Creates Task and Generates PDF
		$scope.submittry = function(item){ 
			$scope.msg = '';
			$scope.responseOnUnsave = '';
			var values = $scope.checkedIds;               	 
			var modifiedparams = {};
			$scope.created = false;
			$scope.createdBy = {};

			//Create Consent Annex rows
			$scope.getPDFs = function(modifiedparams,y){
				return ConsentAnnex.save(modifiedparams).$promise.then(function(result) {
					if(result.$promise.$$state.status == 1)
					{	 
						$scope.createdBy = result.createdBy;
						y++;											
						$scope.createTask(y);		                    													
					}

				}).catch(function(){
					internalError();
				});
			};
			//Downloads multiple PDFs as zip 
			$scope.downloadAsZip = function(){
				$http.get('./config.json').then(function (response) {
					var link = response.data["test-server"].ENVIRONMENT.SERVICE_URI+'consent-annex-pdf/'+ $scope.createdBy;
					$http({method: 'GET',url: link,responseType: 'arraybuffer'}).then(function (response) {
						var bin = new Blob([response.data]);
						var docName = 'Consent Files.zip';           
						saveAs(bin, docName); 
						success();
					}).catch(function(){
						internalError();
					});	
					
				});			
			}

			var y = 0;
			$scope.createTask = function(y){
				if(y<$scope.checkedIds.length){
					var currentId = values[y].id; 	
					//Creating Object to send it to Consent Annex				
					modifiedparams['payercountry'] = {id: JSON.stringify($scope.id.collectingCtry)};
					modifiedparams['profilecountry'] = {id: JSON.stringify($scope.id.profileCountry)};
					modifiedparams['profileType'] = $scope.searchCriteria.profileType;
					modifiedparams['bpid'] = {id: currentId};
					modifiedparams['tmpl_id'] = {id: JSON.stringify($scope.request.tmpl_id)};
					modifiedparams['eventname'] = item.request[currentId].eventname;
					modifiedparams['pocode'] = item.request[currentId].pocode;
					modifiedparams['acmcode'] = item.request[currentId].acmcode;
					//R2.0 - arunkv
					//TODO: conditionally set
					modifiedparams['regionId'] = $scope.regionIdSelection;
					modifiedparams['tempProfile'] = values[y].isTempProfile;

					if($scope.dataToSend.setDates == false){
					modifiedparams['consentstartdate'] = item.request[currentId].consentstartdate;
					modifiedparams['consentenddate'] = item.request[currentId].consentenddate;
					modifiedparams['startdate'] = item.request[currentId].consentstartdate.format("YYYY-MM-DD");;
					modifiedparams['enddate'] = item.request[currentId].consentenddate.format("YYYY-MM-DD");;
					}
					else{
					modifiedparams['eventEndDate'] = item.request[currentId].eventEndDate;
					}
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
		
		//Loading History
		$scope.consentAttributes = {};
        $scope.view = function(id,firstName,lastName,organisationName) { 
        $rootScope.fname = firstName;
        $rootScope.lname = lastName;
        $rootScope.organisationName = organisationName;
        var profileid = id
        $scope.consentAttributes = ConsentAnnex.query({id : profileid, regId : $scope.request.regionId});
        $scope.consentAttributes.hisFirstName = firstName;
        $scope.consentAttributes.hisLastName = lastName;
        $scope.itemCopy = [].concat($scope.consentAttributes);
        $scope.isResetConsentHistory = true;             
        if($scope.consentAttributes==''){
                     $scope.error = "No Records Found";
                     console.log($scope.error);
               }
        };    
      
        //Start : Changes for View Link of Pending Task
        $scope.viewTemplate = function(item){
        	console.log("fname : "+$rootScope.fname);
        	ConsentAnnexView.update({ id:item.id }, item).$promise.then(function(res){
            	
            	if(res.$promise.$$state.status==1){
            		$http.get('./config.json').then(function (response) {
    					var link = response.data["test-server"].ENVIRONMENT.SERVICE_URI+'consent-pdf/'+item.id;
    					$http({method: 'GET',url: link,responseType: 'arraybuffer'}).then(function (response) {
    						var bin = new Blob([response.data]);
    						var docName='';
    						if(item.bpid.profileType == "HCP"){
    						docName = $rootScope.lname+','+$rootScope.fname+'.pdf'; 
    						}else{
    						docName = $rootScope.organisationName+'.pdf'; 
    						}
    						console.log("doc name is : "+docName);
    						saveAs(bin, docName); 
    						toasty.success({
    	            	        title: 'Success',
    	            	        msg: 'PDF Downloaded Successfully!',
    	            	        showClose: true,
    	            	        clickToClose: true,
    	            	        timeout: 5000,
    	            	        sound: false,
    	            	        html: false,
    	            	        shake: false,
    	            	        theme: 'bootstrap'
    	            	      });
    					}).catch(function(){
    						internalError();
    					});	
    					
    				});
            	}else{
            			unspecifiedError();	            		
            		}
            	    	            	
 		      }).catch(function(){
	 		    	// refresh();
	 		    	 internalError();	
	       		 });
        };
        //End
        
        $scope.evaluateMail = function(item){
        	console.log("item details : "+item.createdBy);
        	var emailDetails = item.createdBy+"@pfizer.com";
        	
        	window.location.href = 'mailto:'+emailDetails;
        };
        
        $scope.validationCCID='';
        $scope.uniqueTypeCodeCCID = '';
        $scope.validateCCID = function(){
        	$rootScope.CCID = $scope.uniqueTypeCodeCCID;
        	var regionId = 5;
        	console.log("Item in here : "+$scope.uniqueTypeCodeCCID);
        	
        	ValidatedCode.get({id : $scope.uniqueTypeCodeCCID,regionId : regionId}).$promise
        	.then(function(result) {
                if(result.$promise.$$state.status == 1)
            	{
             	   {
             		   $scope.trData=result;  
             		   $scope.validationCCID="false";
             		   $scope.success="CCID is duplicate";
             		   $scope.uniqueTypeCodeCCID = '';
                	}
                	
                	}
               
              }).catch(function(){
           	  
             	 $scope.validationCCID="true";
             	 $scope.error="CCID is valid";
              });
        	
      	  
      	   
         }; 
         
         $scope.validationNIT='';
         $scope.uniqueTypeCodeNIT = '';
         $scope.validateNIT = function(){ 
        	 $rootScope.NIT = $scope.uniqueTypeCodeNIT;
         	var regionId = 5;
         	console.log("NIT in here : "+$scope.uniqueTypeCodeNIT);
         	ValidatedCode.get({id : $scope.uniqueTypeCodeNIT,regionId : regionId}).$promise
         	.then(function(result) {
                 if(result.$promise.$$state.status == 1)
             	{
              	   {
              		   $scope.trData=result;  
              		   $scope.validationNIT="false";
              		   $scope.success="NIT is duplicate";
              		   $scope.uniqueTypeCodeNIT = '';
                 	}
                 	
                 	}
                
               }).catch(function(){
            	  
              	 $scope.validationNIT="true";
              	 $scope.error="NIT is valid";
               });
         	
       	  
       	   
          };
	}
})();
