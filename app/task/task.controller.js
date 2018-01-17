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
		    
		    console.log(tableState);
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
          		    if(found == -1) $scope.selected.push(id);		    
          		    else $scope.selected.splice(found, 1);	    
          }

		 
          
          

          $scope.loadData = function() {
            if (!$scope.loaded) {
               console.log($scope.searchparam);
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
	            	console.log(response);
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
	            	console.log(res);
	            	if(res.$promise.$$state.status==1){
	            		$http.get('./config.json').then(function (response) {
	    					var link = response.data["test-server"].ENVIRONMENT.SERVICE_URI+'consent-pdf/'+item.id;
	    					$http({method: 'GET',url: link,responseType: 'arraybuffer'}).then(function (response) {
	    						var bin = new Blob([response.data]);
	    						var docName = item.id+'.pdf';           
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
			 console.log(item.id);
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
	            	console.log(response);
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
  			 console.log(item.id);
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
 	           	console.log(response);
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
			console.log(item.id);
			$scope.success='';
			$scope.error='';
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.deleted = 'true';
					con.taskstatus = "DELETED";
					con.deleteReason = item.deleteReason.Name;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.updatedDate = new Date();
					
				}
			});
			Task.update({ id:item.id }, item).$promise.then(function(response){
	           	console.log(response);
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
			console.log(item.id);
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
	           	console.log(response);
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
			console.log(item.id);
			$scope.success='';
			$scope.error='';
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.deleted = 'false';
					con.taskstatus = "INCOMPLETE";
					con.deleteReason = item.deleteReason;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.updatedDate = new Date();
				}
			});
			//Task.update({
			//	id : item.id
			//}, item);
			Task.update({ id:item.id }, item).$promise.then(function(response){
	           	console.log(response);
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
