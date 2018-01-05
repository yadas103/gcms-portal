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

	ProfileSearch.$inject = ['ProfileSearch','$scope','$http','myService','Templates','Country','IdentityRequest','Review','EmailGeneration','UserProfile','LoggedUserDetail','ConsentAnnex','ConsentAnnexPdf','$rootScope','toasty','ngDialog'];

	function ProfileSearch(ProfileSearch,$scope,$http,myService,Templates,Country,IdentityRequest,Review,EmailGeneration,UserProfile,LoggedUserDetail,ConsentAnnex,ConsentAnnexPdf,$rootScope,toasty,ngDialog) {

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
		$scope.readOnlyPC = false;
		$scope.request.profileType = 'HCP';	
		$scope.profile.readOnly = false;
		$scope.hideHCO = true;
		$scope.crossInCountry = {};
		$scope.profileTypeSelected = {};
		$scope.templateTypeSelected = {};	
		$scope.clearText = "";
		$scope.sysAdmin = false;		
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
		//Getting Logged in User Profile
				
		        $scope.userProfileData = function(){		        	
					var currentprofile = $rootScope.currentProfile;
					
					$scope.loggedInUserCountry = currentprofile.countryId;
					$scope.loggedInUserCountryName = currentprofile.countryName ;
					$scope.loggedInUserRole = currentprofile.roleId;
					$scope.logged_In_User= currentprofile.userName;
					
					if($scope.loggedInUserRole == 5){
						$scope.sysAdmin = true;
					}
						
					
					if ($scope.loggedInUserRole == 2 || $scope.loggedInUserRole == 3 ){	
						 $scope.request.collectingCountry = $scope.loggedInUserCountryName;
						 $scope.request.country = $scope.loggedInUserCountryName;
						 $scope.readOnlyCC = true;
						 $scope.readOnlyPC = true;
					}
					else if ($scope.loggedInUserRole == 1 || $scope.loggedInUserRole == 4 || $scope.loggedInUserRole == 5)
					{	
						 $scope.request.collectingCountry = $scope.loggedInUserCountryName;
						 //$scope.readOnlyCC = true;
					}											               
		};
				
		
		
		$scope.compare = function(){	
			$scope.request.tmpl_id = $scope.clearText;
			$scope.setDownload = ($scope.selectedids.length == 0 || $scope.request.tmpl_id == undefined || $scope.request.tmpl_id == "" ) ? true : false;
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
		
		$scope.clear = function()
		{
			$scope.request.lastName = $scope.clearText;
			$scope.request.city = $scope.clearText;
			$scope.request.firstName = $scope.clearText;
			$scope.request.address = $scope.clearText;
			$scope.request.tmpl_id = $scope.clearText;
			$scope.request.speciality = $scope.clearText;
			$scope.setDownload = ($scope.selectedids.length == 0 || $scope.request.tmpl_id == undefined || $scope.request.tmpl_id == "" ) ? true : false;
		};

		//Function to search for requested profiles
		$scope.submit = function(request) {
			$scope.responseOnSearch = '';			
			params =  request;
			$scope.profile.country = request.country;        	
			$scope.selectedids = [];
			$scope.cntryValue = request.country;
			var data = {"country":"","profileType":"","lastName":"","city":"","firstName":"","address":"","collectingCountry":"","speciality":""};
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
			data.speciality = (params.speciality !== undefined && params.speciality !== "") ? params.speciality : 'speciality';
			data.collectingCountry = params.collectingCountry;
			ProfileSearch.get(data).$promise
			.then(function(profileSearch) {
				$scope.profileSearch = profileSearch;
				if($scope.search !== undefined){
					$scope.search = undefined;
				}
				$scope.isReset = true;
				if($scope.request.profileType == 'HCP'){
					$scope.hideHCO = true;
					$scope.hideHCP = false;
				}else if($scope.request.profileType == 'HCO'){
					$scope.hideHCP = true;
					$scope.hideHCO = false;
				}

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
					$http.get('./emailproperties.json').then(function (response) {

						if( response.data.production.value === 'yes'){

							$scope.emaildetails[emailTo] = $scope.countryReviwer; 
							$scope.emaildetails[emailFrom] = $scope.logged_In_User; 
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
							$scope.emaildetails[message] = "MailTo:  "+ $scope.countryReviwer +"-<br/><br/><br/>"+
							"This is to inform you that the below profile creation request has been submitted for you to review.<br/>"+
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
							"MailTo:  "+ $scope.countryReviwer +"-<br/>"+
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
				
		};
		
		//Create missing profile : Empty First/Last/Org name text box based on the profile type selection
		$scope.erase = function(item){
			if(item.profileTypeId.Name == 'HCP'){
				item.organizationName = '';
			}
			else if(item.profileTypeId.Name == 'HCO'){
				item.firstName = '';
				item.lastName = ''
			}
			console.log(item);
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
				$scope.dataToSend.request[$scope.checkedIds[i].id] = {"acmcode" : "","eventname" : "","pocode" : "","tmpl_id" : "","consentstartdate" : "","consentenddate" : "","eventEndDate": ""};
				$scope.dataToSend.request[$scope.checkedIds[i].id].consentstartdate =  moment.tz($scope.currentYear+'/01/01',moment.tz.guess()) ;
				$scope.dataToSend.request[$scope.checkedIds[i].id].consentenddate = moment.tz($scope.currentYear+'/12/31',moment.tz.guess());				
			}
			for(var i in $scope.templates){
				if($scope.templates[i].id == $scope.request.tmpl_id){							
					$scope.daterange = $scope.templates[i].dates_rages;
					if($scope.daterange == 'Y' ){
						$scope.dataToSend.setDates = false;
					}
					else
					{
						$scope.dataToSend.setDates = true;
					}
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
				item.request[$scope.copyCheckedIds[i]].eventEndDate = copy.eventEndDate;
				item.request[$scope.copyCheckedIds[i]].consentstartdate = copy.consentstartdate == undefined? moment.tz($scope.currentYear+'/01/01',moment.tz.guess()) : copy.consentstartdate ;
				item.request[$scope.copyCheckedIds[i]].consentenddate = copy.consentenddate == undefined? moment.tz($scope.currentYear+'/12/31',moment.tz.guess()) : copy.consentenddate;
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
					if($scope.dataToSend.setDates == false){
					modifiedparams['consentstartdate'] = item.request[currentId].consentstartdate;
					modifiedparams['consentenddate'] = item.request[currentId].consentenddate;
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
        $scope.view = function(id) { 
        var profileid = id;
        $scope.consentAttributes = ConsentAnnex.query({id : profileid});
        $scope.itemCopy = [].concat($scope.consentAttributes);
        $scope.isResetConsentHistory = true;             
        if($scope.consentAttributes==''){
                     $scope.error = "No Records Found";
                     console.log($scope.error);
               }
        };    
           
                     
	}
})();
