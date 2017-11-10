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

  TaskController.$inject = ['$rootScope','$scope','$filter','Task','FileUploader','FileMonitor','localeMapper','UserDetail','CONFIG','toasty' ];

  
  function TaskController($rootScope, $scope,$filter,Task,FileUploader,FileMonitor,localeMapper,UserDetail,CONFIG,toasty ){
	  
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
		 
		 $scope.Groupsearch=CONFIG.completionStatus;
		 $scope.selected = [];
		 $scope.itemsByPage = 6;
		 $scope.callServer = function(tableState) {
			$scope.selected = [];  
		    $scope.isLoading = true;
		    var pagination = tableState.pagination;
		    var search = tableState.search;
		    var sort = tableState.sort;
		    var predicate = sort.predicate;
		    var reverse = sort.reverse || false;
		    var start = pagination.start || 0;
		    var number = pagination.number || $scope.itemsByPage;
		    
		    console.log(tableState);
		    return Task.get({
		    	payercountry :tableState.search.predicateObject.pyercountry,
		    	lastName : tableState.search.predicateObject.lastname,
		    	firstName :tableState.search.predicateObject.firstname,
		    	profilecountry : tableState.search.predicateObject.profilecountry,
		    	eventName :tableState.search.predicateObject.eventname,
		    	consentStaus : tableState.search.predicateObject.consentstaus,
		    	taskStatus : tableState.search.predicateObject.taskstatus,
		    	initiatedBy :tableState.search.predicateObject.initiatedby,	    	
		        page : 1+(start/number),
		        size : number,
		        sort : predicate,
		        reverse : reverse 
		        }).$promise.then(function(task) {
		        	$scope.TaskAttributes = task.currentPageData;	
		        	tableState.pagination.numberOfPages =Math.ceil(task.totalRecordsCount/$scope.itemsByPage);
		            $scope.isLoading = false;
		        });
		    
		  }
		
		var assigned=$scope.assigned;
        var updateUserDetail = function(result){
            $scope.user = result;
          };
	  
          var loadUserDetail = function(){
            $scope.user = [];
            UserDetail.query().$promise.then(updateUserDetail);
          };

          loadUserDetail();

          $scope.$on('$localeChangeSuccess', loadUserDetail);
          
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
	  /*$scope.dldata=[];
	  $scope.mouseIN=function(con){            
		  con['AddressType']='primary Address';
		  con['Source System Code[P]']='DLU-P-GCMS';
		  con['Source System Code[T]']='DLU-T-GCMS';
		  con['Transaction Comments']='Consent update from GCMS';
	      $scope.dldata = [con];
	      console.log("value ",con);
	  }
	 
	  $scope.mouseOUT=function(con){
		  $scope.con=con;
	     // delete con['Address Type'];
	     // delete con['Source System Code[P]'];
	     // delete con['Source System Code[T]'];
	     // delete con['Transaction Comments'];
	     
	      console.log("value2 ",con);
	  }
	  $scope.value=function(con){
		  $scope.con=con;
	  }*/
	  /**
	     * selim
	     * @name getTaskData
	     * @methodOf 
	     * @description Gets data
	     */
      
	  /*var getTaskData = function(){
		    
		     return Task.query().$promise.then(function(task){
		       $scope.TaskAttributes = task;
		       
		      // console.log(task);
		      });
		  };	  
	  getTaskData();
	  $scope.displayedCollection = [].concat($scope.TaskAttributes);*/
	  
	  /**
	   *  selim
       *  Bulk upload fuctionality
       */
      $scope.uploads = [];
      $scope.alerts = [];
      $scope.locale = localeMapper.getCurrentISOCode();

      $scope.uploader = new FileUploader({
        filters: [{
          fn: function(item) {
            var flag = false;
            for (var i in this.queue){
              if (item.name === this.queue[i].file.name){
                flag = true;
              }
            }

            if (flag){
              item.name += '(' + (this.queue.length + 1) + ')';
            }

            return true;
          }
        }],

        url: '../gcms-service/' + $scope.locale + '/bulk-upload'
       
      });   
      $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
      $scope.upload = function() {
   	   console.log("Inside upload");
          //if ($scope.uploader.queue.length > 0) {
   	   $scope.success='';
 	   $scope.error='';
       	   return FileMonitor.query().$promise.then(function(result){
   		       $scope.Result = result;
   		       $scope.alerts.push({type:'success', msg: $scope.uploader.queue.length + 'File(s) Processing Successful'});
   		       $scope.uploader.clearQueue();
   		       console.log(result)		       
   		      }).catch(function(){
     		    	$scope.uploader.clearQueue(); 
     		    	toasty.error({
   			          title: 'Error',
   			          msg: 'File(s) proccessing failed ! Internal Server Error',
   			          showClose: true,
   			          clickToClose: true,
   			          timeout: 5000,
   			          sound: false,
   			          html: false,
   			          shake: false,
   			          theme: 'bootstrap'
   			        });
       		    	//$scope.error="File(s) not able to process ";
       		      });
   		  //};
            
          }
		 
	  
	 
		
		
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
	           // Task.update({ id:item.id }, item);
	         	Task.update({ id:item.id }, item).$promise.then(function(response){
	            	console.log(response);
	            	if(response.$promise.$$state.status==1)
	            		{
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
	 		      }).catch(internalError);
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
 			      }).catch(internalError);
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
					con.deleteReason = item.deleteReason;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.updatedDate = new Date();
				}
			});
			Task.update({ id:item.id }, item).$promise.then(function(response){
	           	console.log(response);
	           	if(response.$promise.$$state.status==1)
	           		{
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
			      }).catch(internalError);
			//Task.update({
			//	id : item.id
			//}, item);
		};
		$scope.updateReassign = function(item) {
			console.log("Inside updateReassign function");
			console.log(item.id);
			$scope.success='';
			$scope.error='';
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.assignedto = item.assignedto;
                     con.updatedDate = new Date();
				}
			});
			Task.update({ id:item.id }, item).$promise.then(function(response){
	           	console.log(response);
	           	if(response.$promise.$$state.status==1)
	           		{
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
			      }).catch(internalError);
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
			      }).catch(internalError);
		};
		 	          
		 
		// $scope.$on('$localeChangeSuccess', getTaskData);
		   
		   
		  
    
  }
})();
