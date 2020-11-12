/**
 * @ngdoc overview
 * @name gcms.task
 * 
 * @description Represents a task controller.
 */
(function () {
  'use strict';


  angular
    .module('gcms.task')
    .controller('TaskCtrl', TaskController);

  TaskController.$inject = ['$rootScope','$scope','$filter','Task','Users','toasty','PDFDownload','$http','ConsentPdf' ];

  
  function TaskController($rootScope, $scope,$filter,Task,Users,toasty,PDFDownload,$http,ConsentPdf ){
	  
	  console.log("Inside task controller");
	  	
	  	
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
	  
		 $scope.currentProfile={};
		 var mydata= $rootScope.loggedInUserRoleId;	
		 var currentProfileDetail = $rootScope.currentProfile;
		 $scope.regionId = currentProfileDetail.regionId;
		 $scope.loaded = false;
		 $scope.downloadAll = false;
         $scope.data = [];
		 $scope.searchparam=null;
		 $scope.sortparam=null;
		 $scope.totalcount=null;
		 $scope.tableState = null;
		 $scope.firstload=false;
		 $scope.selected = [];
		 $scope.itemsByPage = 15;
		 $scope.excelSheetDLUAll = {} ;
		 $scope.excelSheetSummaryAll = {} ;
		 var taskOwner = {};
		 $scope.callServer = function(tableState) {
			 $scope.tableState =tableState;
			 if(!$scope.firstload){
				 $scope.firstload=true;
				 return;
			 }
			 			 
		    $scope.isLoading = true;
		    var pagination = tableState.pagination;
		    var search = tableState.search;
		    $scope.searchparam=tableState.search;
		    $scope.status=tableState.search.predicateObject.taskstatus == undefined ? 'INCOMPLETE' : tableState.search.predicateObject.taskstatus;
		    if($scope.status=='INCOMPLETE'||$scope.status=='DELETED'){
		    	 $scope.selected = [];
		    }
		    $scope.data = [];
		   // $scope.selected = [];
		    var sort = tableState.sort;
		    var predicate = sort.predicate;
		    $scope.sortparam=sort.predicate;
		    var reverse = sort.reverse || false;
		    var start = pagination.start || 0;
		    var number = pagination.number || $scope.itemsByPage;
		    
		  
		    return Task.get({
		    	payercountry :tableState.search.predicateObject.payercountry,
		    	lastName : tableState.search.predicateObject.lastname,
		    	firstName :tableState.search.predicateObject.firstname,
		    	profilecountry : tableState.search.predicateObject.profilecountry,
		    	eventName :tableState.search.predicateObject.eventname,
		    	consentStaus : tableState.search.predicateObject.consentstaus,
		    	taskStatus : tableState.search.predicateObject.taskstatus,
		    	initiatedBy :tableState.search.predicateObject.initiatedby,	
		    	updateddate : tableState.search.predicateObject.updateddate,
		    	regionId : $scope.regionId,
		    	tempProfile : tableState.search.predicateObject.tempProfile,
		        page : 1+(start/number),
		        size : number,
		        sort : predicate,
		        reverse : reverse 
		        }).$promise.then(function(task) {
		        	$scope.TaskAttributes = task.currentPageData;
		        	for(var i in $scope.TaskAttributes){
			        	if(($scope.TaskAttributes[i].consannexid.consentstartdate != null || $scope.TaskAttributes[i].consannexid.consentstartdate != undefined) && ($scope.TaskAttributes[i].consannexid.consentenddate != null || $scope.TaskAttributes[i].consannexid.consentenddate != undefined)){
			        	$scope.TaskAttributes[i].consannexid.startdate = moment($scope.TaskAttributes[i].consannexid.consentstartdate,'YYYY-MM-DD');
		                $scope.TaskAttributes[i].consannexid.enddate = moment($scope.TaskAttributes[i].consannexid.consentenddate,'YYYY-MM-DD');  
		                $scope.TaskAttributes[i].consannexid.consentstart = moment($scope.TaskAttributes[i].consannexid.consentstartdate,'YYYY-MM-DD');
		                $scope.TaskAttributes[i].consannexid.consentend = moment($scope.TaskAttributes[i].consannexid.consentenddate,'YYYY-MM-DD');
			        	}
			        	}
		        	$scope.totalcount=task.totalRecordsCount;
		        	tableState.pagination.numberOfPages =Math.ceil(task.totalRecordsCount/$scope.itemsByPage);
		            $scope.isLoading = false;
		            $scope.loaded = false;
		        });
		    
		  }
		
		
		 var refresh=function(){
			 $scope.callServer($scope.tableState);
			 
		 }
		 
		
		 
		var assigned=$scope.assigned;
        var updateUsers = function(result){
            $scope.user = result;
          };
	  
          var loadUsers = function(){
            $scope.user = [];
            Users.query().$promise.then(updateUsers);
          };

          loadUsers();

          $scope.$on('$localeChangeSuccess', loadUsers);
          
	  /**
		 * selim
		 * 
		 * @ngdoc method
		 * @methodOf this method used for DLU-P/T excel generation
		 * @description Gets data
		 */

                
          $scope.select = function(inputId) {
          	var result = false;      	  
        	  	var id =  angular.copy(inputId);
        	  	$scope.compare = function() {
  	      		for(var i in $scope.selected){
  	      			result = angular.equals($scope.selected[i].id, id.id);
  	      	    if(result == true){
  	      	    	$scope.selected.splice(i, 1);
  	      	    	break;
  	      	    }     	    
  	      		  }
  	      		 if(result == false) {
  	      			$scope.selected.push(id); 
  	      		 }
  	      	  };
  	      
      		    if(id.consannexid.bpid.profileType == 'HCP'){
      		    	id.consannexid.bpid.profileType = 'PERSON';
      		    	id.consannexid.lastOrgName = id.consannexid.bpid.lastName;
  				}
  				else if(id.consannexid.bpid.profileType == 'HCO'){
  					id.consannexid.bpid.profileType = 'ORGANIZATION';
  					id.consannexid.lastOrgName = id.consannexid.bpid.organisationName;
  				}
      		    if(id.consannexid.consentenddate != null){
  					id.consannexid.consentenddate = moment(id.consannexid.consentenddate).format('DD/MM/YYYY');					
  					}
  					if(id.consannexid.consentstartdate != null){
  					id.consannexid.consentstartdate = moment(id.consannexid.consentstartdate).format('DD/MM/YYYY');				
  					}						
  						if(id.consannexid.eventEndDate != null){
  							id.consannexid.eventEndDate = moment(id.consannexid.eventEndDate).format('DD/MM/YYYY');
  						}
  						id.consannexid.profilecountry.code = id.consannexid.profilecountry.code.substring(0,2);
  					id.updatedDate = moment(id.updatedDate).format('DD/MM/YYYY');
      		    id.consannexid.PartyAddressType = "Primary Address";
      		    id.consannexid.SourceSystemCode = "DLU-P";
      		    id.consannexid.CustomFlexField15 = "Consent Downloaded from GCMS"
      		    id.consannexid.trid = "TR-ID";     		    
      	      	  $scope.compare();   	      	
      };  
      
      
      $scope.selectedDLUPDownload = function(selected){
      	var excelSheetDLUPSel = {};
      	for(var i in selected){
      	excelSheetDLUPSel[i] = { 
  				'Record_type':'',
  				'TR Party ID': selected[i].consannexid.bpid.id, 
  				'Party_Type':selected[i].consannexid.bpid.profileType,
  				'Organization':(selected[i].consannexid.bpid.organisationName == null || selected[i].consannexid.bpid.organisationName == undefined ) ? '' : selected[i].consannexid.bpid.organisationName,
  				'Party Last Name':(selected[i].consannexid.bpid.lastName == null || selected[i].consannexid.bpid.lastName == undefined ) ? '' : selected[i].consannexid.bpid.lastName,
  				'Party First Name':(selected[i].consannexid.bpid.firstName == null || selected[i].consannexid.bpid.firstName == undefined ) ? '' : selected[i].consannexid.bpid.firstName, 
  				'Party Middle Name':'',
  				'Party Credential':'',
  				'Party Primary Specialty':'',
  				'Party Title':'',
  				'Party Prefix':'',
  				'Party Suffix Name':'',
  				'Party Email Address':'',
  				'Party Role/Type of Attendee':'',
  				'Source System Identifier for Party':'',
  				'Party ID_1':'',
  				'Party ID Type_1':'',
  				'Party ID_2':'',
  				'Party ID Type_2':'',
  				'Party ID_3':'',
  				'Party ID Type_3':'',
  				'Party ID_4':'',
  				'Party ID Type_4':'',
  				'Party ID_5':'',
  				'Party ID Type_5':'',
  				'Party ID_6':'',
  				'Party ID Type_6':'',
  				'Party ID_7':'',
  				'Party ID Type_7':'',
  				'Party ID_8':'',
  				'Party ID Type_8':'',
  				'Party ID_9':'',
  				'Party ID Type_9':'',
  				'Party ID_10':'',
  				'Party ID Type_10':'',
  				'Party Address Type':"Primary Address",
  				'Party Address Line 1':(selected[i].consannexid.bpid.address == null || selected[i].consannexid.bpid.address == undefined ) ? '' : selected[i].consannexid.bpid.address,
  				'Party Address Line 2':'', 
  				'Party Address Line 3':'', 
  				'Party Address Line 4':'', 
  				'Party Region':'',
  				'Party County':'',
  				'Party Province':'',
  				'Party Canton':'',
  				'Party City':(selected[i].consannexid.bpid.city == null || selected[i].consannexid.bpid.city == undefined ) ? '' : selected[i].consannexid.bpid.city,
  				'Party Postal/Zip Code':'',
  				'Party State':'',
  				'Party Country Code (2 character ISO)':selected[i].consannexid.profilecountry.code.substring(0,2), 
  				'Source System Identifier for Party_s Address': '',
  				'Consent_editor':'',
  				'Consent_required':'',
  				'Consent_Status':selected[i].consannexid.consentstatus.consentName,
  				'Consent_status_reason': '',
  				'Consent_Start_Date':(selected[i].consannexid.consentstartdate == null || selected[i].consannexid.consentstartdate == undefined ) ? '' : selected[i].consannexid.consentstartdate,
  				'Consent_End_Date':(selected[i].consannexid.consentenddate == null || selected[i].consannexid.consentenddate == undefined ) ? '' : selected[i].consannexid.consentenddate,
  				'Active Flag SAP':'',
  				'Parent Institution ID':'',
  				'Parent Institution Type':'',
  				'FCPA Type':'',
  				'File Name':'',
  				'Source System Code':'DLU-P',
  				'Source Sub-System Code':'',
  				'Custom/Flex Field 1':'',
  				'Custom/Flex Field 2':'',
  				'Custom/Flex Field 3':'',
  				'Custom/Flex Field 4':'',
  				'Custom/Flex Field 5':'',
  				'Custom/Flex Field 6':'',
  				'Custom/Flex Field 7':'',
  				'Custom/Flex Field 8':'',
  				'Custom/Flex Field 9':'',
  				'Custom/Flex Field 10':'',
  				'Custom/Flex Field 11':'',
  				'Custom/Flex Field 12':'',
  				'Custom/Flex Field 13':'',
  				'Custom/Flex Field 14':'',
  				'Custom/Flex Field 15':"Consent Downloaded from GCMS",
  				'Custom/Flex Field 16':'',
  				'Custom/Flex Field 17':'',
  				'Custom/Flex Field 18':'',
  				'Custom/Flex Field 19':'',
  				'Custom/Flex Field 20':''						
  				} ;				
      	}
  		var data1 = excelSheetDLUPSel;
          var opts = [{sheetid:'Data',header:true}];
          var res = alasql('SELECT INTO XLSX("Data.xlsx",?) FROM ?',[opts,[data1]]); 
      };
      
      $scope.selectedTableSummaryDownload = function(selected){
      	var excelSheetSummarySel = {};
      	for(var i in selected){
      		var taskOwnerFN = ($scope.selected[i].assignedto.firstName == null || $scope.selected[i].assignedto.firstName == undefined ) ? '' : $scope.selected[i].assignedto.firstName;
  			var taskOwnerLN = ($scope.selected[i].assignedto.lastName == null || $scope.selected[i].assignedto.lastName == undefined ) ? '' : $scope.selected[i].assignedto.lastName;
  			var taskOwnerUN = $scope.selected[i].assignedto.userName;
  			var space = " ";
  			taskOwner = taskOwnerFN.concat(space);
  			taskOwner = taskOwner.concat(taskOwnerLN);
  			taskOwner = taskOwner.concat("(");
  			taskOwner = taskOwner.concat(taskOwnerUN);
  			taskOwner = taskOwner.concat(")");
      	excelSheetSummarySel[i] = { 
      			'Party Type':selected[i].consannexid.bpid.profileType, 
    			'BP ID':selected[i].consannexid.bpid.id, 
    			'Last/Org Name':(selected[i].consannexid.bpid.profileType == 'PERSON' ? ((selected[i].consannexid.bpid.lastName == null || selected[i].consannexid.bpid.lastName == undefined ) ? '' : selected[i].consannexid.bpid.lastName) : ((selected[i].consannexid.bpid.organisationName == null || selected[i].consannexid.bpid.organisationName == undefined ) ? '' : selected[i].consannexid.bpid.organisationName) ), 
    			'First Name':(selected[i].consannexid.bpid.firstName == null || selected[i].consannexid.bpid.firstName == undefined ) ? '' : selected[i].consannexid.bpid.firstName, 
    			'Profile Country':selected[i].consannexid.profilecountry.code.substring(0,2),	
    			'Payer Country':selected[i].consannexid.payercountry.code.substring(0,2), 
    			'Event Name':(selected[i].consannexid.eventname == null || selected[i].consannexid.eventname == undefined ) ? '' : selected[i].consannexid.eventname,    			    		
    			'PO Code': (selected[i].consannexid.pocode == null || selected[i].consannexid.pocode == undefined ) ? '' : selected[i].consannexid.pocode,
				'ACM Code':(selected[i].consannexid.acmcode == null || selected[i].consannexid.acmcode == undefined ) ? '' : selected[i].consannexid.acmcode,
    			'Consent Status':selected[i].consannexid.consentstatus.consentName,
    			'Consent Updated Date':selected[i].updatedDate,
    			'Consent Start Date':(selected[i].consannexid.consentstartdate == null || selected[i].consannexid.consentstartdate == undefined ) ? '' : selected[i].consannexid.consentstartdate,
				'Consent End Date':(selected[i].consannexid.consentenddate == null || selected[i].consannexid.consentenddate == undefined ) ? '' : selected[i].consannexid.consentenddate,
    			'Event End Date': (selected[i].consannexid.eventEndDate == null || selected[i].consannexid.eventEndDate == undefined ) ? '' : selected[i].consannexid.eventEndDate,
    			'Task Owner Last Name':selected[i].assignedto.lastName, 
    			'Task Owner First Name':selected[i].assignedto.firstName, 
    			'NTID':selected[i].assignedto.userName,
    			'Task Status':selected[i].taskstatus
    			} ;     	
      	}
  		var data1 = excelSheetSummarySel;
  		var opts = [{sheetid:'Summary',header:true}];
  		var res = alasql('SELECT INTO XLSX("Summary.xlsx",?) FROM ?',[opts,[data1]]);
      
      };
      
      
      
      $scope.loadDataDLUAll = function() {   
          if (!$scope.downloadAll) {               
             Task.get({
  		    	payercountry :$scope.searchparam.predicateObject.payercountry,
  		    	lastName : $scope.searchparam.predicateObject.lastname,
  		    	firstName :$scope.searchparam.predicateObject.firstname,
  		    	profilecountry : $scope.searchparam.predicateObject.profilecountry,
  		    	eventName :$scope.searchparam.predicateObject.eventname,
  		    	consentStaus : $scope.searchparam.predicateObject.consentstaus,
  		    	taskStatus : $scope.searchparam.predicateObject.taskstatus,
  		    	initiatedBy :$scope.searchparam.predicateObject.initiatedby,	
  		    	updateddate : $scope.searchparam.predicateObject.updateddate,
  		        page : 1,
  		        size : $scope.totalcount,
  		        sort : $scope.sortparam,
  		        reverse : false 
  		        }).$promise.then(function(task) {
  		        	$scope.data = task.currentPageData;
  		        	for(var i  in $scope.data){
  						if($scope.data[i].consannexid.bpid.profileType == 'HCP'){
  							$scope.data[i].consannexid.bpid.profileType = 'PERSON';
  						}
  						else if($scope.data[i].consannexid.bpid.profileType == 'HCO'){
  							$scope.data[i].consannexid.bpid.profileType = 'ORGANIZATION';
  						}
  						if($scope.data[i].consannexid.consentenddate != null){
  						$scope.data[i].consannexid.consentenddate = moment($scope.data[i].consannexid.consentenddate).format('DD/MM/YYYY');
  						}
  						if($scope.data[i].consannexid.consentstartdate != null){
  						$scope.data[i].consannexid.consentstartdate = moment($scope.data[i].consannexid.consentstartdate).format('DD/MM/YYYY');
  						}						
  	
  							$scope.excelSheetDLUAll[i] = { 
  							'Record_type':'',
  							'TR Party ID': $scope.data[i].consannexid.bpid.id, 
  							'Party_Type':$scope.data[i].consannexid.bpid.profileType,
  							'Organization':($scope.data[i].consannexid.bpid.organisationName == null || $scope.data[i].consannexid.bpid.organisationName == undefined ) ? '' : $scope.data[i].consannexid.bpid.organisationName,
  							'Party Last Name':($scope.data[i].consannexid.bpid.lastName == null || $scope.data[i].consannexid.bpid.lastName == undefined ) ? '' : $scope.data[i].consannexid.bpid.lastName,
  							'Party First Name':($scope.data[i].consannexid.bpid.firstName == null || $scope.data[i].consannexid.bpid.firstName == undefined ) ? '' : $scope.data[i].consannexid.bpid.firstName, 
  							'Party Middle Name':'',
  							'Party Credential':'',
  							'Party Primary Specialty':'',
  							'Party Title':'',
  							'Party Prefix':'',
  							'Party Suffix Name':'',
  							'Party Email Address':'',
  							'Party Role/Type of Attendee':'',
  							'Source System Identifier for Party':'',
  							'Party ID_1':'',
  							'Party ID Type_1':'',
  							'Party ID_2':'',
  							'Party ID Type_2':'',
  							'Party ID_3':'',
  							'Party ID Type_3':'',
  							'Party ID_4':'',
  							'Party ID Type_4':'',
  							'Party ID_5':'',
  							'Party ID Type_5':'',
  							'Party ID_6':'',
  							'Party ID Type_6':'',
  							'Party ID_7':'',
  							'Party ID Type_7':'',
  							'Party ID_8':'',
  							'Party ID Type_8':'',
  							'Party ID_9':'',
  							'Party ID Type_9':'',
  							'Party ID_10':'',
  							'Party ID Type_10':'',
  							'Party Address Type':"Primary Address",
  							'Party Address Line 1':($scope.data[i].consannexid.bpid.address == null || $scope.data[i].consannexid.bpid.address == undefined ) ? '' : $scope.data[i].consannexid.bpid.address,  
  							'Party Address Line 2':'', 
  							'Party Address Line 3':'', 
  							'Party Address Line 4':'', 
  							'Party Region':'',
  							'Party County':'',
  							'Party Province':'',
  							'Party Canton':'',
  							'Party City':($scope.data[i].consannexid.bpid.city == null || $scope.data[i].consannexid.bpid.city == undefined ) ? '' : $scope.data[i].consannexid.bpid.city,
  							'Party Postal/Zip Code':'',
  							'Party State':'',
  							'Party Country Code (2 character ISO)':$scope.data[i].consannexid.profilecountry.code.substring(0,2), 
  							'Source System Identifier for Party_s Address': '',
  							'Consent_editor':'',
  							'Consent_required':'',
  							'Consent_Status':$scope.data[i].consannexid.consentstatus.consentName,
  							'Consent_status_reason': '',
  							'Consent_Start_Date':($scope.data[i].consannexid.consentstartdate == null || $scope.data[i].consannexid.consentstartdate == undefined ) ? '' : $scope.data[i].consannexid.consentstartdate,
  							'Consent_End_Date':($scope.data[i].consannexid.consentenddate == null || $scope.data[i].consannexid.consentenddate == undefined ) ? '' : $scope.data[i].consannexid.consentenddate,
  							'Active Flag SAP':'',
  							'Parent Institution ID':'',
  							'Parent Institution Type':'',
  							'FCPA Type':'',
  							'File Name':'',
  							'Source System Code':'DLU-P',
  							'Source Sub-System Code':'',
  							'Custom/Flex Field 1':'',
  							'Custom/Flex Field 2':'',
  							'Custom/Flex Field 3':'',
  							'Custom/Flex Field 4':'',
  							'Custom/Flex Field 5':'',
  							'Custom/Flex Field 6':'',
  							'Custom/Flex Field 7':'',
  							'Custom/Flex Field 8':'',
  							'Custom/Flex Field 9':'',
  							'Custom/Flex Field 10':'',
  							'Custom/Flex Field 11':'',
  							'Custom/Flex Field 12':'',
  							'Custom/Flex Field 13':'',
  							'Custom/Flex Field 14':'',
  							'Custom/Flex Field 15':"Consent Downloaded from GCMS",
  							'Custom/Flex Field 16':'',
  							'Custom/Flex Field 17':'',
  							'Custom/Flex Field 18':'',
  							'Custom/Flex Field 19':'',
  							'Custom/Flex Field 20':''
  							
  							
  							
  							} ;	
  																				
  					}
  					var data1 = $scope.excelSheetDLUAll;
  		            var opts = [{sheetid:'Data',header:true}];
  		            var res = alasql('SELECT INTO XLSX("Data.xlsx",?) FROM ?',[opts,[data1]]);
  		        	$scope.downloadAll = true;
  		            
  		        });
          }
        }


     
      $scope.loadData = function() {
        if (!$scope.loaded) {               
           Task.get({
  		    	payercountry :$scope.searchparam.predicateObject.payercountry,
  		    	lastName : $scope.searchparam.predicateObject.lastname,
  		    	firstName :$scope.searchparam.predicateObject.firstname,
  		    	profilecountry : $scope.searchparam.predicateObject.profilecountry,
  		    	eventName :$scope.searchparam.predicateObject.eventname,
  		    	consentStaus : $scope.searchparam.predicateObject.consentstaus,
  		    	taskStatus : $scope.searchparam.predicateObject.taskstatus,
  		    	initiatedBy :$scope.searchparam.predicateObject.initiatedby,	
  		    	updateddate : $scope.searchparam.predicateObject.updateddate,
  		        page : 1,
  		        size : $scope.totalcount,
  		        sort : $scope.sortparam,
  		        reverse : false 
  		        }).$promise.then(function(task) {
  		        	$scope.data = task.currentPageData;
  		        	for(var i  in $scope.data){
  						if($scope.data[i].consannexid.bpid.profileType == 'HCP'){
  							$scope.data[i].consannexid.bpid.profileType = 'PERSON';
  							$scope.data[i].consannexid.lastOrgName = $scope.data[i].consannexid.bpid.lastName;
  						}
  						else if($scope.data[i].consannexid.bpid.profileType == 'HCO'){
  							$scope.data[i].consannexid.bpid.profileType = 'ORGANIZATION';
  							$scope.data[i].consannexid.lastOrgName = $scope.data[i].consannexid.bpid.organisationName;
  						}
  						if($scope.data[i].consannexid.consentenddate != null){
  							$scope.data[i].consannexid.consentenddate = moment($scope.data[i].consannexid.consentenddate).format('DD/MM/YYYY');
  							}
  							if($scope.data[i].consannexid.consentstartdate != null){
  							$scope.data[i].consannexid.consentstartdate = moment($scope.data[i].consannexid.consentstartdate).format('DD/MM/YYYY');
  							}
  							$scope.data[i].updatedDate = moment($scope.data[i].updatedDate).format('DD/MM/YYYY');	
  							if($scope.data[i].consannexid.eventEndDate != null){
  								$scope.data[i].consannexid.eventEndDate = moment($scope.data[i].consannexid.eventEndDate).format('DD/MM/YYYY');
  							}
  							
  							var taskOwnerFN = ($scope.data[i].assignedto.firstName == null || $scope.data[i].assignedto.firstName == undefined ) ? '' : $scope.data[i].assignedto.firstName;
  							var taskOwnerLN = ($scope.data[i].assignedto.lastName == null || $scope.data[i].assignedto.lastName == undefined ) ? '' : $scope.data[i].assignedto.lastName;
  							var taskOwnerUN = $scope.data[i].assignedto.userName;
  							var space = " ";
  							taskOwner = taskOwnerFN.concat(space);
  							taskOwner = taskOwner.concat(taskOwnerLN);
  							taskOwner = taskOwner.concat("(");
  							taskOwner = taskOwner.concat(taskOwnerUN);
  							taskOwner = taskOwner.concat(")");
  							
  							$scope.excelSheetSummaryAll[i] = { 
  									'Party Type':$scope.data[i].consannexid.bpid.profileType, 
  									'BP ID':$scope.data[i].consannexid.bpid.id, 
  									'Last/Org Name':($scope.data[i].consannexid.bpid.profileType == 'PERSON' ? (($scope.data[i].consannexid.bpid.lastName == null || $scope.data[i].consannexid.bpid.lastName == undefined ) ? '' : $scope.data[i].consannexid.bpid.lastName) : (($scope.data[i].consannexid.bpid.organisationName == null || $scope.data[i].consannexid.bpid.organisationName == undefined ) ? '' : $scope.data[i].consannexid.bpid.organisationName) ), 
  									'First Name':($scope.data[i].consannexid.bpid.firstName == null || $scope.data[i].consannexid.bpid.firstName == undefined ) ? '' : $scope.data[i].consannexid.bpid.firstName, 
  									'Profile Country':$scope.data[i].consannexid.profilecountry.code.substring(0,2),	
  									'Payer Country':$scope.data[i].consannexid.payercountry.code.substring(0,2), 
  									'Event Name':($scope.data[i].consannexid.eventname == null || $scope.data[i].consannexid.eventname == undefined ) ? '' : $scope.data[i].consannexid.eventname,
  									'PO Code': ($scope.data[i].consannexid.pocode == null || $scope.data[i].consannexid.pocode == undefined ) ? '' : $scope.data[i].consannexid.pocode,
  									'ACM Code':($scope.data[i].consannexid.acmcode == null || $scope.data[i].consannexid.acmcode == undefined ) ? '' : $scope.data[i].consannexid.acmcode,
  									'Consent Status':$scope.data[i].consannexid.consentstatus.consentName,
  									'Consent Updated Date':$scope.data[i].updatedDate,
  									'Consent Start Date':($scope.data[i].consannexid.consentstartdate == null || $scope.data[i].consannexid.consentstartdate == undefined ) ? '' : $scope.data[i].consannexid.consentstartdate,
  									'Consent End Date':($scope.data[i].consannexid.consentenddate == null || $scope.data[i].consannexid.consentenddate == undefined ) ? '' : $scope.data[i].consannexid.consentenddate,
  									'Event End Date': ($scope.data[i].consannexid.eventEndDate == null || $scope.data[i].consannexid.eventEndDate == undefined ) ? '' : $scope.data[i].consannexid.eventEndDate,
  									'Task Owner Last Name':$scope.data[i].assignedto.lastName, 
  									'Task Owner First Name':$scope.data[i].assignedto.firstName, 
  									'NTID':$scope.data[i].assignedto.userName,
  									'Task Status':$scope.data[i].taskstatus
  									} ;
  							 							
  		        	}	
  		        	
  		        	var data1 = $scope.excelSheetSummaryAll;
  		            var opts = [{sheetid:'Summary',header:true}];
  		            var res = alasql('SELECT INTO XLSX("Summary.xlsx",?) FROM ?',[opts,[data1]]);
  		        	
  		        	$scope.loaded = true;
  		            
  		        });
        }
      }

		
      	
        	$scope.close=function(item) {
          		if(item.consannexid.annnexlocation != undefined){
          			//if(item.consannexid.consentstatus.id != '63' && item.consannexid.eventname != null && item.consannexid.eventname != "")
		      		if(item.consannexid.consentstatus.id != '7004' && item.consannexid.eventname != null && item.consannexid.eventname != ""){
		      			 if(item.consannexid.acmcode != null  ||item.consannexid.pocode != null ){
		      				 if(item.consannexid.acmcode != "" || item.consannexid.pocode != "" ){
		      					item.taskstatus="COMPLETED";
		      				 }else{
				       			item.taskstatus="INCOMPLETE"; 
			     			 }		      				
		      			 }else{
		       				item.taskstatus="INCOMPLETE"; 
		     			 }     			
		      		 }else{
		      				item.taskstatus="INCOMPLETE"; 
	     			 }
		      	 }else{
      				item.taskstatus="INCOMPLETE"; 
     			 }
             	delete item.click; 
             	// Task.update({ id:item.id }, item);
             	Task.update({ id:item.id }, item).$promise.then(function(response){
	            	
	            	if(response.$promise.$$state.status==1)
	            		{
	            		refresh();
	            		
	            		
	            		// $scope.success= item.id + " task has been updated
						// successfully";
	            		}else{
	            			unspecifiedError();
	            		// $scope.error= item.id + " task failed to update";
	            		}
	 		      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		 });
             	 
             	}
		
        	/**
			 * selim
			 * 
			 * @ngdoc method
			 * @name Pdf Download
			 * @methodOf
			 * @description
			 * 
			 */
          
        	
        	$scope.download=function(item){
    			console.log("inside download") 
    			
    			 
	            if(item.consannexid.consentstart != undefined)
	 	           {
	            	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	 	           }
	 	           else
	 	           {	        	   
	 	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	 	           }
	 	           if(item.consannexid.consentend != undefined)
	 	           {
	 	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	 	           }
	 	           else
	 	           {	        	   
	 	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
	 		       }
	 	           if(item.consannexid.consentstart != undefined)
	 	           {
	 	        	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	 	           }
	 	           else
	 	           {	        	   
	 	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	 	           }
	 	           if(item.consannexid.consentend != undefined)
	 	           {
	 	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	 	           }
	 	           else
	 	           {	        	   
	 	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
	 		       }
	            	item.consannexid.startdate = moment.tz(item.consannexid.consentstart,moment.tz.guess());   			
	            	item.consannexid.enddate = moment.tz(item.consannexid.consentend,moment.tz.guess());	     		       	   	     			          
	            	item.consannexid.startdate = moment(item.consannexid.consentstart).format('YYYY-MM-DD');   			
	            	item.consannexid.enddate = moment(item.consannexid.consentend).format('YYYY-MM-DD');
	            	delete item.consannexid.consentstart;
			        delete item.consannexid.consentend;
			        delete item.consannexid.startdate;
			        delete item.consannexid.enddate;	
			       if(item.consannexid.startdate  == "Invalid date" || item.consannexid.startdate  == undefined ){
		        	   delete item.consannexid.startdate ;
		           }	     			           
		           if(item.consannexid.enddate == "Invalid date" || item.consannexid.enddate == undefined){
		        	   delete item.consannexid.enddate;
		           }
    			
    			PDFDownload.update({ id:item.id }, item).$promise.then(function(res){
	            	
	            	if(res.$promise.$$state.status==1){
	            		$http.get('./config.json').then(function (response) {
	    					var link = response.data["test-server"].ENVIRONMENT.SERVICE_URI+'consent-pdf/'+item.id;
	    					$http({method: 'GET',url: link,responseType: 'arraybuffer'}).then(function (response) {
	    						var bin = new Blob([response.data]);
	    						var docName='';
	    						if(item.consannexid.bpid.profileType == "HCP"){
	    						docName = item.consannexid.bpid.lastName+','+item.consannexid.bpid.firstName+'.pdf'; 
	    						}else{
	    						docName = item.consannexid.bpid.organisationName+'.pdf'; 
	    						}
          
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
	
		/**
		 * selim
		 * 
		 * @ngdoc method
		 * @name update
		 * @methodOf
		 * @description Updates Task
		 * @param {object}
		 *            item Task to update
		 */
      
       
		 $scope.update = function(item) {
			 console.log("Inside update function");
			 
			 $scope.success='';
			 $scope.error='';
	         angular.forEach($scope.TaskAttributes, function(con){
	            	
	         if (con.id === item.id) {
	       
	           con.updatedDate = new Date(); 
	           con.consannexid.updatedDate = new Date();
	         }
	            });
	         if(item.consannexid.annnexlocation != undefined){
	        	 //if(item.consannexid.consentstatus.id != '63' && item.consannexid.eventname != null && item.consannexid.eventname != "")
		      		if(item.consannexid.consentstatus.id != '7004' && item.consannexid.eventname != null && item.consannexid.eventname != ""){
		      			 if(item.consannexid.acmcode != null  ||item.consannexid.pocode != null ){
		      				 if(item.consannexid.acmcode != "" || item.consannexid.pocode != "" ){
		      					item.taskstatus="COMPLETED";
		      				 }else{
				       				item.taskstatus="INCOMPLETE"; 
			     			 }		      				
		      			 }else{
		       				item.taskstatus="INCOMPLETE"; 
		     			 }     			
		      		 }else{
		      				item.taskstatus="INCOMPLETE"; 
	     			 }
		      	 }else{
   				item.taskstatus="INCOMPLETE"; 
  			 }
	         
	       // Input Date format
	           if(item.consannexid.consentstart != undefined){
	           item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else{	        	   
	           item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined){
	           item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else{	        	   
		           item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		           }
   		
	           // Adding timezone
	           item.consannexid.consentstartdate = moment.tz(item.consannexid.consentstart,moment.tz.guess());   			
	           item.consannexid.consentenddate = moment.tz(item.consannexid.consentend,moment.tz.guess());
     	   
	           // Convert to DB date format
	           item.consannexid.consentstartdate = moment(item.consannexid.consentstart).format('YYYY-MM-DD');   			
	           item.consannexid.consentenddate = moment(item.consannexid.consentend).format('YYYY-MM-DD');

	           delete item.consannexid.consentend;
	           delete item.consannexid.consentstart;
	           delete item.consannexid.enddate;
	           delete item.consannexid.startdate;
	         
	           if(item.consannexid.consentstartdate == "Invalid date" || item.consannexid.consentstartdate == undefined ){
	        	   delete item.consannexid.consentstartdate;
	           }
	           
	           if(item.consannexid.consentenddate == "Invalid date" || item.consannexid.consentenddate == undefined){
	        	   delete item.consannexid.consentenddate;
	           }
	           
		         delete item.click;
	           // Task.update({ id:item.id }, item);
	         	Task.update({ id:item.id }, item).$promise.then(function(response){
	            	
	            	if(response.$promise.$$state.status==1)
	            		{
	            		refresh();
	            		toasty.success({
	            	        title: 'Success',
	            	        msg: 'Task Updated !',
	            	        showClose: true,
	            	        clickToClose: true,
	            	        timeout: 5000,
	            	        sound: false,
	            	        html: false,
	            	        shake: false,
	            	        theme: 'bootstrap'
	            	      });
	            		
	            		// $scope.success= item.id + " task has been updated
						// successfully";
	            		}else{
	            			unspecifiedError();
	            		// $scope.error= item.id + " task failed to update";
	            		}
	 		      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		 });
	          };
	          
	          
	       
          /**
			 * @ngdoc method
			 * @name update
			 * @methodOf
			 * @description Updates Task
			 * @param {object}
			 *            item Task to update
			 */
  		 $scope.revoke = function(item) {
  			 console.log("Inside revoke function");
  			
  			$scope.success='';
			$scope.error='';
  	         angular.forEach($scope.TaskAttributes, function(con){
  	            	
  	         if (con.id === item.id) {
  	           con.consannexid.consentstatus.id=62;
  	           con.updatedDate = new Date();      
  	              }
  	            });            
  	           // Task.update({ id:item.id }, item);
  	         	Task.update({ id:item.id }, item).$promise.then(function(response){
 	          
 	           	if(response.$promise.$$state.status==1)
 	           		{
 	           	toasty.success({
        	        title: 'Success',
        	        msg: 'Task Revoked !',
        	        showClose: true,
        	        clickToClose: true,
        	        timeout: 5000,
        	        sound: false,
        	        html: false,
        	        shake: false,
        	        theme: 'bootstrap'
        	      });
 	           		// $scope.success= item.id + " task has been revoked ";
 	           		}else{
 	           		unspecifiedError();
 	           		// $scope.error= item.id + " task failed to revoke";
 	           		}
 			      }).catch(function(){
	 		    	 refresh();
	 		    	 internalError();	
	       		      });
  	          };  
	          
	      


  	     $scope.updateDelete = function(item) {
			console.log("Inside updateDelete function");
			
			$scope.success='';
			$scope.error='';
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.deleted = 'true';
					con.taskstatus = "DELETED";
					con.deleteReason = item.deleteReason.Name;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.undeleteReason='';
					con.updatedDate = new Date();
					
				}
			});
			if(item.consannexid.consentstart != undefined)
	           {
         	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined)
	           {
	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		       }
	           if(item.consannexid.consentstart != undefined)
	           {
	        	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined)
	           {
	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		       }
         	item.consannexid.startdate = moment.tz(item.consannexid.consentstart,moment.tz.guess());   			
         	item.consannexid.enddate = moment.tz(item.consannexid.consentend,moment.tz.guess());	     		       	   	     			          
         	item.consannexid.startdate = moment(item.consannexid.consentstart).format('YYYY-MM-DD');   			
         	item.consannexid.enddate = moment(item.consannexid.consentend).format('YYYY-MM-DD');
         	delete item.consannexid.consentstart;
		        delete item.consannexid.consentend;
		        delete item.consannexid.startdate;
		        delete item.consannexid.enddate;	
		       if(item.consannexid.startdate  == "Invalid date" || item.consannexid.startdate  == undefined ){
	        	   delete item.consannexid.startdate ;
	           }	     			           
	           if(item.consannexid.enddate == "Invalid date" || item.consannexid.enddate == undefined){
	        	   delete item.consannexid.enddate;
	           }
			
			Task.update({ id:item.id }, item).$promise.then(function(response){
	          
	           	if(response.$promise.$$state.status==1)
	           		{
	           		refresh();
	           		toasty.success({
	        	        title: 'Success',
	        	        msg: 'Task Deleted!',
	        	        showClose: true,
	        	        clickToClose: true,
	        	        timeout: 5000,
	        	        sound: false,
	        	        html: false,
	        	        shake: false,
	        	        theme: 'bootstrap'
	        	      });
	           		// $scope.success= item.id + " task has been deleted ";
	           		}else{
	           		unspecifiedError();
	           		// $scope.error= item.id + " task failed to delete";
	           		}
			      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		      });
			// Task.update({
			// id : item.id
			// }, item);
		};
		$scope.count='null';
	
	    $scope.onCategoryChange = function (item) {
	    	item.reassignReason='';
	    	 $scope.count=1;
	    	
	    	 
	    } 
		$scope.updateReassign = function(item) {
			console.log("Inside updateReassign function");
			
			item.assignedto=item.changedowner;
			
			$scope.success='';
			$scope.error='';
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
                     con.updatedDate = new Date();
                     delete item.assignedto.id;
                     delete item.assignedto.countryCode;
                     delete item.assignedto.countryId;
                     delete item.assignedto.errors;
                     delete item.changedowner;
				}
			});
			
			if(item.consannexid.consentstart != undefined)
	           {
         	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined)
	           {
	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		       }
	           if(item.consannexid.consentstart != undefined)
	           {
	        	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined)
	           {
	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		       }
         	item.consannexid.startdate = moment.tz(item.consannexid.consentstart,moment.tz.guess());   			
         	item.consannexid.enddate = moment.tz(item.consannexid.consentend,moment.tz.guess());	     		       	   	     			          
         	item.consannexid.startdate = moment(item.consannexid.consentstart).format('YYYY-MM-DD');   			
         	item.consannexid.enddate = moment(item.consannexid.consentend).format('YYYY-MM-DD');
         	delete item.consannexid.consentstart;
		        delete item.consannexid.consentend;
		        delete item.consannexid.startdate;
		        delete item.consannexid.enddate;	
		       if(item.consannexid.startdate  == "Invalid date" || item.consannexid.startdate  == undefined ){
	        	   delete item.consannexid.startdate ;
	           }	     			           
	           if(item.consannexid.enddate == "Invalid date" || item.consannexid.enddate == undefined){
	        	   delete item.consannexid.enddate;
	           }
			
			
			
			Task.update({ id:item.id }, item).$promise.then(function(response){
	          
	           	if(response.$promise.$$state.status==1)
	           		{
	           		refresh();
	           		toasty.success({
	        	        title: 'Success',
	        	        msg: 'Task Reassigned!',
	        	        showClose: true,
	        	        clickToClose: true,
	        	        timeout: 5000,
	        	        sound: false,
	        	        html: false,
	        	        shake: false,
	        	        theme: 'bootstrap'
	        	      });
	           		// $scope.success= item.id + " task has been reassigned to
					// "+ item.assignedto;
	           		}else{
	           			unspecifiedError();
	           		// $scope.error= item.id + " task failed to reassigned";
	           		}
			      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		      });
			// Task.update({
			// id : item.id
			// }, item);
		};

		$scope.updateUnDelete = function(item) {
			console.log("Inside updateDelete function");
			
			$scope.success='';
			$scope.error='';
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.deleted = 'false';
					con.taskstatus = "INCOMPLETE";
					con.deleteReason = '';
					con.deleteReasonDesc = '';
					con.updatedDate = new Date();
				}
			});
			// Task.update({
			// id : item.id
			// }, item);
			
			if(item.consannexid.consentstart != undefined)
	           {
         	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined)
	           {
	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		       }
	           if(item.consannexid.consentstart != undefined)
	           {
	        	item.consannexid.consentstart = moment(item.consannexid.consentstart,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	item.consannexid.consentstart = moment(item.consannexid.startdate,'DD-MM-YYYY');
	           }
	           if(item.consannexid.consentend != undefined)
	           {
	        	  item.consannexid.consentend = moment(item.consannexid.consentend,'DD-MM-YYYY');
	           }
	           else
	           {	        	   
	        	  item.consannexid.consentend = moment(item.consannexid.enddate,'DD-MM-YYYY');
		       }
         	item.consannexid.startdate = moment.tz(item.consannexid.consentstart,moment.tz.guess());   			
         	item.consannexid.enddate = moment.tz(item.consannexid.consentend,moment.tz.guess());	     		       	   	     			          
         	item.consannexid.startdate = moment(item.consannexid.consentstart).format('YYYY-MM-DD');   			
         	item.consannexid.enddate = moment(item.consannexid.consentend).format('YYYY-MM-DD');
         	delete item.consannexid.consentstart;
		        delete item.consannexid.consentend;
		        delete item.consannexid.startdate;
		        delete item.consannexid.enddate;	
		       if(item.consannexid.startdate  == "Invalid date" || item.consannexid.startdate  == undefined ){
	        	   delete item.consannexid.startdate ;
	           }	     			           
	           if(item.consannexid.enddate == "Invalid date" || item.consannexid.enddate == undefined){
	        	   delete item.consannexid.enddate;
	           }
			
			
			Task.update({ id:item.id }, item).$promise.then(function(response){
	           
	           	if(response.$promise.$$state.status==1)
	           		{
	           		refresh();
	           		toasty.success({
	        	        title: 'Success',
	        	        msg: 'Task Undeleted!',
	        	        showClose: true,
	        	        clickToClose: true,
	        	        timeout: 5000,
	        	        sound: false,
	        	        html: false,
	        	        shake: false,
	        	        theme: 'bootstrap'
	        	      });
	           		// $scope.success= item.id + " task has been undeleted";
	           		}else{
	           			unspecifiedError();
	           		// $scope.error= item.id + " task failed to undelete";
	           		}
			      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		      });
		};
		 	          
		 
		// $scope.$on('$localeChangeSuccess', getTaskData);
		   
		   
		  
    
  }
})();
