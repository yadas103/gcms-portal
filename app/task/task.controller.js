/**
 * @ngdoc overview
 * @name gcms.task
 *
 * @description
 * Represents a task controller.
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
		    $scope.status=tableState.search.predicateObject.taskstatus;
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
		        page : 1+(start/number),
		        size : number,
		        sort : predicate,
		        reverse : reverse 
		        }).$promise.then(function(task) {
		        	$scope.TaskAttributes = task.currentPageData;	
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
	     * @ngdoc method
	     * @methodOf this method used for DLU-P/T excel generation
	     * @description Gets data
	     */

                
             	  
          $scope.select = function(id) {		    
    		    var found = $scope.selected.indexOf(id);
    		    if(id.consannexid.bpid.profileType == 'HCP'){
    		    	id.consannexid.bpid.profileType = 'PERSON';
				}
				else if(id.consannexid.bpid.profileType == 'HCO'){
					id.consannexid.bpid.profileType = 'ORGANIZATION';
				}
    		    if(id.consannexid.consentenddate != null){
					id.consannexid.consentenddate = moment(id.consannexid.consentenddate).format('DD/MM/YYYY');					
					}
					if(id.consannexid.consentstartdate != null){
					id.consannexid.consentstartdate = moment(id.consannexid.consentstartdate).format('DD/MM/YYYY');				
					}
					if(id.consannexid.bpid.city != null){
						if(id.consannexid.bpid.city.match(',') != null ){
							id.consannexid.bpid.city = id.consannexid.bpid.city.replace(/,/g , " ");
						}
						}
						if(id.consannexid.bpid.address != null){
							if(id.consannexid.bpid.address.match(',') != null ){
								id.consannexid.bpid.address = id.consannexid.bpid.address.replace(/,/g , " ");
							}
							}
						if(id.consannexid.bpid.address2 != null){
							if(id.consannexid.bpid.address2.match(',') != null ){
								id.consannexid.bpid.address2 = id.consannexid.bpid.address2.replace(/,/g , " ");
							}
							}
						if(id.consannexid.bpid.address3 != null){
							if(id.consannexid.bpid.address3.match(',') != null ){
								id.consannexid.bpid.address3 = id.consannexid.bpid.address3.replace(/,/g , " ");
							}
							}
						if(id.consannexid.bpid.address4 != null){
							if(id.consannexid.bpid.address4.match(',') != null ){
								id.consannexid.bpid.address4 = id.consannexid.bpid.address4.replace(/,/g , " ");
							}
							}	
						id.consannexid.profilecountry.code = id.consannexid.profilecountry.code.substring(0,2);
					id.updatedDate = moment(id.updatedDate).format('DD/MM/YYYY');
    		    id.consannexid.PartyAddressType = "Primary Address";
    		    id.consannexid.SourceSystemCode = "DLU-P";
    		    id.consannexid.CustomFlexField15 = "Consent Downloaded from GCMS"
    		    id.consannexid.trid = "TR-ID";
    		    
    		    if(found == -1) $scope.selected.push(id);		    
    		    else $scope.selected.splice(found, 1);	    
    }

	 
    
    
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
						if($scope.data[i].consannexid.bpid.city != null){
						if($scope.data[i].consannexid.bpid.city.match(',') != null ){
							$scope.data[i].consannexid.bpid.city = $scope.data[i].consannexid.bpid.city.replace(/,/g , " ");
						}
						}
						if($scope.data[i].consannexid.bpid.address != null){
							if($scope.data[i].consannexid.bpid.address.match(',') != null ){
								$scope.data[i].consannexid.bpid.address = $scope.data[i].consannexid.bpid.address.replace(/,/g , " ");
							}
							}
						if($scope.data[i].consannexid.bpid.address2 != null){
							if($scope.data[i].consannexid.bpid.address2.match(',') != null ){
								$scope.data[i].consannexid.bpid.address2 = $scope.data[i].consannexid.bpid.address2.replace(/,/g , " ");
							}
							}
						if($scope.data[i].consannexid.bpid.address3 != null){
							if($scope.data[i].consannexid.bpid.address3.match(',') != null ){
								$scope.data[i].consannexid.bpid.address3 = $scope.data[i].consannexid.bpid.address3.replace(/,/g , " ");
							}
							}
						if($scope.data[i].consannexid.bpid.address4 != null){
							if($scope.data[i].consannexid.bpid.address4.match(',') != null ){
								$scope.data[i].consannexid.bpid.address4 = $scope.data[i].consannexid.bpid.address4.replace(/,/g , " ");
							}
							}
						$scope.data[i].consannexid.profilecountry.code = $scope.data[i].consannexid.profilecountry.code.substring(0,2);
						$scope.data[i].consannexid.PartyAddressType = "Primary Address";
						$scope.data[i].consannexid.SourceSystemCode = "DLU-P";
						$scope.data[i].consannexid.CustomFlexField15 = "Consent Downloaded from GCMS";
						$scope.data[i].consannexid.trid = "TR-ID";
					}
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
							$scope.data[i].updatedDate = moment($scope.data[i].updatedDate).format('DD/MM/YYYY');						
					}
		        	$scope.loaded = true;
		            
		        });
      }
    }


          
        //On Click of Task Edit, initialize dates
          $scope.taskdate = function(item){        	  	
        	  	item.consannexid.startdate = moment(item.consannexid.consentstartdate,'YYYY-MM-DD');
                item.consannexid.enddate = moment(item.consannexid.consentenddate,'YYYY-MM-DD');  
                item.consannexid.consentstart = moment(item.consannexid.consentstartdate,'YYYY-MM-DD');
                item.consannexid.consentend = moment(item.consannexid.consentenddate,'YYYY-MM-DD');
        	};
		
      	
        	$scope.close=function(item) {
          		if(item.consannexid.annnexlocation != undefined){
		      		if(item.consannexid.consentstatus.id != '63' && item.consannexid.eventname != null && item.consannexid.eventname != ""){
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
	            		
	            		
	            		//$scope.success= item.id + " task has been updated successfully";
	            		}else{
	            			unspecifiedError();
	            		//$scope.error= item.id + " task failed to update";
	            		}
	 		      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		 });
             	 
             	}
		
        	/**
    		 * selim
             * @ngdoc method
             * @name Pdf Download
             * @methodOf 
             * @description 
             * 
             */
          
        	
        	$scope.download=function(item){
    			console.log("inside download")       			
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
         * @ngdoc method
         * @name update
         * @methodOf 
         * @description Updates Task
         * @param {object} item Task to update
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
		      		if(item.consannexid.consentstatus.id != '63' && item.consannexid.eventname != null && item.consannexid.eventname != ""){
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
	         
	       //Input Date format
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
   		
	           //Adding timezone
	           item.consannexid.consentstartdate = moment.tz(item.consannexid.consentstart,moment.tz.guess());   			
	           item.consannexid.consentenddate = moment.tz(item.consannexid.consentend,moment.tz.guess());
     	   
	           //Convert to DB date format
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
	            		
	            		//$scope.success= item.id + " task has been updated successfully";
	            		}else{
	            			unspecifiedError();
	            		//$scope.error= item.id + " task failed to update";
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
           * @param {object} item Task to update
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
 	           		//$scope.success= item.id + " task has been revoked ";
 	           		}else{
 	           		unspecifiedError();
 	           		//$scope.error= item.id + " task failed to revoke";
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
	           		//$scope.success= item.id + " task has been deleted ";
	           		}else{
	           		unspecifiedError();
	           		//$scope.error= item.id + " task failed to delete";
	           		}
			      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		      });
			//Task.update({
			//	id : item.id
			//}, item);
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
	           		//$scope.success= item.id + " task has been reassigned to "+ item.assignedto;
	           		}else{
	           			unspecifiedError();
	           		//$scope.error= item.id + " task failed to reassigned";
	           		}
			      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		      });
			//Task.update({
			//	id : item.id
			//}, item);
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
			//Task.update({
			//	id : item.id
			//}, item);
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
	           		//$scope.success= item.id + " task has been undeleted";
	           		}else{
	           			unspecifiedError();
	           		//$scope.error= item.id + " task failed to undelete";
	           		}
			      }).catch(function(){
		 		    	 refresh();
		 		    	 internalError();	
		       		      });
		};
		 	          
		 
		// $scope.$on('$localeChangeSuccess', getTaskData);
		   
		   
		  
    
  }
})();
