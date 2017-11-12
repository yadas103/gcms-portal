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
	.controller('ProfileListCtrl', ProfileSearch);

	ProfileSearch.$inject = ['ProfileSearch','$scope','$http','$stateParams','$state','myService','Templates','Country','IdentityRequest','Review','EmailGeneration','UserProfile','LoggedUserDetail','ConsentAnnex','ConsentAnnexPdf','$rootScope'];

	function ProfileSearch(ProfileSearch,$scope,$http,$stateParams,$state,myService,Templates,Country,IdentityRequest,Review,EmailGeneration,UserProfile,LoggedUserDetail,ConsentAnnex,ctrl,ConsentAnnexPdf,$rootScope) {

		var params = {};
		console.log("Inside Profile.list.controller");
		$scope.orderByField = 'firstName';
		$scope.reverseSort = false;
		$scope.selectedids = [];  
		$scope.itemsByPage=20;
		$scope.dataToSend = {checkedIds :{},templates :{}};
		var ids = [];
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
		$scope.readOnlyPC = false;
		$scope.request.profileType = 'HCP';
		$scope.dataToSend.setDates = false;
		$scope.profile.readOnly = false;
		$scope.profile_types = [{
			name: 'HCP',
			value: 'HCP'
		},   {
			name: 'HCO',
			value: 'HCO'
		}];

		//Getting Logged in User Profile
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
							$scope.loggedInUserRole = $scope.profiles_data[i].roleId;
						}						
					}
					if ($scope.loggedInUserRole == 2 || $scope.loggedInUserRole == 3 ){	
						$scope.request.collectingCountry = $scope.loggedInUserCountryName;
						$scope.request.country = $scope.loggedInUserCountryName;
						$scope.readOnlyCC = true;
						$scope.readOnlyPC = true;
					}
					else if ($scope.loggedInUserRole == 1 || $scope.loggedInUserRole == 4 || $scope.loggedInUserRole == 5){	
						$scope.request.collectingCountry = $scope.loggedInUserCountryName;
						$scope.readOnlyCC = true;
					}									

				}).catch(function(){
					console.log('Couldnt fetch user profiles');           	
				});

			}).catch(function(){
				console.log('Couldnt fetch user profiles');

			});               
		};
		
		//Called on create missing profile to sent country and lock 
		$scope.passCountryName = function (){
			$scope.profile.country = $scope.request.collectingCountry;
			$scope.profile.readOnly = true;
		};
		
		
		//Calling $scope.userProfileData() to get Logged in User Profile Data
		$scope.userProfileData();

		//Loading Countries
		var updateCountry = function(result){
			$scope.counties = result;         
		};

		var loadCountry = function(){
			$scope.counties = [];
			Country.query().$promise.then(updateCountry);
		};

		loadCountry();

		$scope.$on('$localeChangeSuccess', loadCountry);

		//Function to search for requested profiles
		$scope.submit = function(request) {
			$scope.responseOnSearch = '';			
			params =  request;
			$scope.profile.country = request.country;        	
			$scope.selectedids = [];
			$scope.cntryValue = request.country;
			var data = {"country":"","profileType":"","lastName":"","city":"","firstName":"","address":"","collectingCountry":"","id":""};

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
			data.city = params.city !== undefined ? params.city : 'city';
			data.firstName = params.firstName !== undefined ? params.firstName : 'firstName';
			data.address = params.address !== undefined ? params.address : 'address';
			data.id = params.id !== undefined ? params.id : "0";
			data.collectingCountry = params.collectingCountry;
			ProfileSearch.get(data).$promise
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
					console.log(response);
				}
				else
				{
					console.log(response);
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


		//Creates the missing profile 
		$scope.create = function(item){   
			$scope.responseOnSave = '';
			$scope.responseOnUnsave = '';
			var request = item;
			var reqID = {};
			request.profileTypeId = item.profileTypeId.Name;
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

		//Collects the checked profile id's and related info    
		$scope.list = function(){ 
			$scope.currentYear = new Date();
			$scope.dataToSend = {checkedIds :{},templates :{},request : {}};

			ids['selid'] =  {checked: JSON.stringify($scope.selectedids)};
			ids['selectedParams'] = {selection: JSON.stringify(params)}
			ids['collectingCtry'] = collecting_country_id;
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
			$scope.currentYear = (new Date()).getFullYear();
			
			for(var i  in $scope.checkedIds){
				$scope.dataToSend.request[$scope.checkedIds[i].id] = {"acmcode" : "","eventname" : "","pocode" : "","tmpl_id" : "","consentstartdate" : "","consentenddate" : ""};
				$scope.dataToSend.request[$scope.checkedIds[i].id].consentstartdate = new Date('01/01/'+$scope.currentYear);
				$scope.dataToSend.request[$scope.checkedIds[i].id].consentenddate = new Date('12/31/'+$scope.currentYear);
			}

		};

		$scope.copy = function(item){
			$scope.copyCheckedIds = [];
			$scope.currentYear = (new Date()).getFullYear();
			for(var i  in $scope.item.checkedIds){
				if(item.checkbox[$scope.item.checkedIds[i].id] == true){
					$scope.copyCheckedIds.push($scope.item.checkedIds[i].id);
				}
			}
			 	
			for(var i  in $scope.copyCheckedIds){
				
				}
			
			for(var i  in $scope.copyCheckedIds){
				item.request[$scope.item.checkedIds[i].id] = {"acmcode" : "","eventname" : "","pocode" : "","consentstartdate" : new Date('01/01/'+$scope.currentYear) ,"consentenddate" : new Date('12/31/'+$scope.currentYear)};				
				item.request[$scope.item.checkedIds[i].id].acmcode = $scope.item.copyAcmcode;
				item.request[$scope.item.checkedIds[i].id].eventname = $scope.item.copyEventName;
				item.request[$scope.item.checkedIds[i].id].pocode = $scope.item.copyPocode;
				item.request[$scope.item.checkedIds[i].id].consentstartdate = $scope.item.copyConsentStartDate == undefined? new Date('01/01/'+$scope.currentYear) : $scope.item.copyConsentStartDate ;
				item.request[$scope.item.checkedIds[i].id].consentenddate = $scope.item.copyConsentEndDate == undefined? new Date('12/31/'+$scope.currentYear) : $scope.item.copyConsentEndDate;
			}
		}
		
		//Loads all templates 
		var updateTemplates = function(result){
			$scope.templates = result;             
			$scope.dataToSend.templates = $scope.templates;
		};

		//Filter on Template
		$scope.templateFilter = function (result){
			$scope.crossInCountry = $scope.request.collectingCountry==$scope.request.country? 'InCountry' : 'CrossBorder';
			$scope.profileTypeSelected = $scope.request.profileType;
			$scope.templateTypeSelected = $scope.crossInCountry+'-'+$scope.profileTypeSelected;
			
			if(result.cntry_id.name == $scope.request.country && result.tmpl_status == "ACTIVE" && (result.tmpl_type == $scope.templateTypeSelected )){							
				$scope.daterange = result.dates_rages;
				if($scope.daterange == 'Y' ){
					$scope.dataToSend.setDates = true;
				}
				if(result.tmpl_location == null){
					$scope.notInRepo = "No template uploaded in Repositry for "+result.tmpl_name;
				}
			}
			
			return ((result.cntry_id.name == $scope.request.country) && (result.tmpl_status == "ACTIVE") && (result.tmpl_type == $scope.templateTypeSelected ));
		}
		
		$scope.change = function(){
		 $scope.setDownload = $scope.request.tmpl_id == undefined ? true : false;
		};
		
		//Filters templates based on Reporting Country
		$scope.customArrayFilter = function (result) {
			$scope.allTemplates = result;
			$scope.id = myService.get();
			$scope.checkedIds = $scope.id.selid.checked;
			$scope.checkedIds = JSON.parse($scope.checkedIds);
			$scope.cntryValue = $scope.id.selectedParams.selection;
			$scope.searchCriteria = JSON.parse($scope.cntryValue);
			$scope.cntryValue = $scope.searchCriteria.country;
			$scope.crossInCountry = $scope.id.collectingCtry==$scope.id.profileCountry? 'InCountry' : 'CrossBorder';
			$scope.profileTypeSelected = $scope.searchCriteria.profileType;
			$scope.templateTypeSelected = $scope.crossInCountry+'-'+$scope.profileTypeSelected;
				
			if(result.cntry_id.name == $scope.cntryValue && result.tmpl_status == "ACTIVE" && (result.tmpl_type == $scope.templateTypeSelected )){
				$scope.templId = result.id;
				$scope.profileCountry_Id = result.cntry_id.id;
				$scope.daterange = result.dates_rages;
				if($scope.daterange == 'Y' ){
					$scope.dataToSend.setDates = true;
				}
				if(result.tmpl_location == null){
					$scope.notInRepo = "No template uploaded in Repositry" + result.tmpl_name;
				}
			}
			
			return ((result.cntry_id.name == $scope.cntryValue) && (result.tmpl_status == "ACTIVE") && (result.tmpl_type == $scope.templateTypeSelected ));
		}
		
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
			Templates.update({ id: item.id }, item);     
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
						$scope.responseOnSave = "Record saved"
						$scope.createTask(y);		                    													
					}

				}).catch(function(){
					$scope.responseOnUnsave = "Unable to generate PDF";
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
						$scope.msg = "You can see the generated PDF in your Downloads folder";
					}).catch(function(){
						$scope.responseOnUnsave = "Unable to generate PDF";
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
					modifiedparams['consentstartdate'] = item.request[currentId].consentstartdate;
					modifiedparams['consentenddate'] = item.request[currentId].consentenddate;

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
			$scope.view = function(id) { 
			var profileid = id;
			$scope.consentAttributes = ConsentAnnex.query({id : profileid});
			};	
		/*$scope.submitid = function(id) {     		 
			$state.go('profile-detail-view', {id} );
		};  */                
	}
})();
