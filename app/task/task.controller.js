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

  TaskController.$inject = ['$rootScope','$scope','$filter','Task','FileUploader','FileMonitor','localeMapper','LoggedUserDetail','UserDetail'];

  
  function TaskController($rootScope, $scope,$filter,Task,FileUploader,FileMonitor,localeMapper,LoggedUserDetail,UserDetail){
	  
	  console.log("Inside task controller");
	  	$scope.success='';
		$scope.error='';
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
          
          LoggedUserDetail.query().$promise
          .then(function(loggedInUser) {
            $scope.loggeduser = loggedInUser;
            console.log($scope.loggeduser);
          });
	  /**
	   	 * selim 
	     * @ngdoc method
	     * @methodOf this method used for DLU-P/T excel generation
	     * @description Gets data
	     */

                
          $scope.selected = [];     	  
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
      
	  var getTaskData = function(){
		    
		     return Task.query().$promise.then(function(task){
		       $scope.TaskAttributes = task;
		       
		      // console.log(task);
		      });
		  };	  
	  getTaskData();
	  $scope.displayedCollection = [].concat($scope.TaskAttributes);
	  
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
       		    	$scope.error="File(s) not able to process ";
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
	            		$scope.success= item.id + " task has been updated successfully";
	            		}else{
	            		$scope.error= item.id + " task failed to update";
	            		}
	 		      }).catch(function(){
	     		    	 
	 		    	 $scope.error= item.id + " task failed to update";
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
 	           		$scope.success= item.id + " task has been revoked ";
 	           		}else{
 	           		$scope.error= item.id + " task failed to revoke";
 	           		}
 			      }).catch(function(){
	     		    	 
 			    	 $scope.error= item.id + " task failed to revoke";
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
					con.deleteReason = item.deleteReason;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.updatedDate = new Date();
				}
			});
			Task.update({ id:item.id }, item).$promise.then(function(response){
	           	console.log(response);
	           	if(response.$promise.$$state.status==1)
	           		{
	           		$scope.success= item.id + " task has been deleted ";
	           		}else{
	           		$scope.error= item.id + " task failed to delete";
	           		}
			      }).catch(function(){
	     		    	 
			    	  $scope.error= item.id + " task failed to delete";
	 	       		   });
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
	           		$scope.success= item.id + " task has been reassigned to "+ item.assignedto;
	           		}else{
	           		$scope.error= item.id + " task failed to reassigned";
	           		}
			      }).catch(function(){
	     		    	 
			    	  $scope.error= item.id + " task failed to reassigned";
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
	           		$scope.success= item.id + " task has been undeleted";
	           		}else{
	           		$scope.error= item.id + " task failed to undelete";
	           		}
			      }).catch(function(){
	     		    	 
			    	  $scope.error= item.id + " task failed to undelete";
	 	       		   });
		};
		 	          
		 
		 $scope.$on('$localeChangeSuccess', getTaskData);
		   
		   
		  
    
  }
})();
