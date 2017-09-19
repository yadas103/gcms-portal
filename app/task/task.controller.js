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

  TaskController.$inject = ['$rootScope','$scope','$filter','Task','UserProfiles','reassign'];

  
  function TaskController($rootScope, $scope,$filter,Task,UserProfiles,reassign){
	  
	  
	  console.log("Inside controller");
	  $scope.add = function (newValue) {
          var obj = {};
          obj.Name = newValue;
          obj.Value = newValue;
          $scope.Groups.push(obj);
          $scope.group.name = obj;
          $scope.newValue = '';
      } 

      $scope.Groups = [{
          Name: 'Wrong name selected',
          Value: 'd1'
      }, {
          Name: 'Event canceled',
          Value: 'A2'
      }, {
          Name: 'No payment',
          Value: 'c3'
      },   {
          Name: 'Other reason',
          Value: 'new'
      }];
      $scope.group = {
          name: ""
      }
	  /**
	     * @ngdoc method
	     * @name getData
	     * @methodOf 
	     * @description Gets data
	     */
      
	  var getData = function(){
		    
		     return Task.query().$promise.then(function(task){
		       $scope.TaskAttributes = task;
		       console.log(task);
		      });
		  };
	  
	  getData();  

	  var getData1 = function(){
		    
		     return UserProfiles.query().$promise.then(function(UserProfiles){
		       $scope.userProfiles = UserProfiles;
		       console.log(UserProfiles);
		      });
		  };
	  
	  getData1();  
	  
	  /**      
       * @description pagination in client side
       * 
       */
		$scope.itemsByPage=5;
		$scope.displayedCollection = [].concat($scope.TaskAttributes);
		/**
         * @ngdoc method
         * @name update
         * @methodOf 
         * @description Updates Task
         * @param {object} item Task to update
         */
		 $scope.update = function(item) {
			 console.log("Inside update function");
			 console.log(item.id);	 
	         angular.forEach($scope.TaskAttributes, function(con){
	            	
	         if (con.id === item.id) {
	           con.consannexid.consentstatus.id=item.consannexid.consentstatus.id;
	           con.updatedDate = new Date();      
	              }
	            });            
	            Task.update({ id:item.id }, item);
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
  	         angular.forEach($scope.TaskAttributes, function(con){
  	            	
  	         if (con.id === item.id) {
  	           con.consannexid.consentstatus.id=62;
  	           con.updatedDate = new Date();      
  	              }
  	            });            
  	            Task.update({ id:item.id }, item);
  	          };  
			  
			  
			  
	          $scope.updateDelete = function(item) {
	 			 console.log("Inside updateDelete function");
	 			 console.log(item.id);	 
	 	         angular.forEach($scope.TaskAttributes, function(con){
	 	            	
	 	         if (con.id === item.id) {
	 	            con.deleted='true';
	 	           con.taskstatus="DELETED";
	 	          con.deleteReason=item.deleteReason;
	 	         con.deleteReasonDesc=item.deleteReasonDesc;
	 	           con.updatedDate = new Date();      
	 	              }
	 	            });            
	 	            Task.update({ id:item.id }, item);
	 	          };
	 	         $scope.updateReassign = function(item) {
		 			 console.log("Inside updateReassign function");
		 			 console.log(item.id);	 
		 	         angular.forEach($scope.TaskAttributes, function(con){
		 	            	
		 	         if (con.id === item.id) {
		 	        	
		 	        	con.assignedto= item.assignedto;
		 	              }
		 	            });            
		 	            Task.update({ id:item.id }, item);
		 	          };
		 	          
		 	         $scope.updateUnDelete = function(item) {
			 			 console.log("Inside updateDelete function");
			 			 console.log(item.id);	 
			 	         angular.forEach($scope.TaskAttributes, function(con){
			 	            	
			 	         if (con.id === item.id) {
			 	            con.deleted='false';
			 	           con.taskstatus="INCOMPLETED";
			 	          con.deleteReason=item.deleteReason;
			 	         con.deleteReasonDesc=item.deleteReasonDesc;
			 	           con.updatedDate = new Date();      
			 	              }
			 	            });            
			 	            Task.update({ id:item.id }, item);
			 	          };
	 	          
	        /*  $scope.updateReassign = function(item) {
	 			 console.log("Inside updateReassign function");
	 			 console.log(item.id);
	 			 angular.forEach($scope.TaskAttributes, function(con){
	 			 if (con.id === item.id) {
	 			 con.assignedto= reassign.get().assignedto;
	 			 }
	 	            });
	 	            Task.update({ id:item.id }, item);
	 	          };*/
	 	          
	      
	          
	 	         $scope.delete = function(item) {
	 	        	 console.log("Inside delete function");
	 	        	
	 	            var index = 0;
	 	            angular.forEach($scope.TaskAttributes, function(con){
	 	              if (con.id === item.id){
	 	            	 console.log(item.deleteReason);
	 	                $scope.TaskAttributes.splice(index, 1);
	 	              }
	 	              index++;
	 	            });
	 	            Task.delete({ id:item.id,'deleteReason': item.deleteReason,'deleteReasonDesc':item.deleteReasonDesc});
	 	          };
	 	          
	          
	           $scope.$on('$localeChangeSuccess', getData);
		   
		   
		  /* $scope.uploader = new FileUploader({
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

		        url: '../GCMSService/upload'
		     
		      });
		   $scope.upload = function() {
		        if ($scope.uploader.queue.length > 0) {
		          $scope.alerts.push({type:'success', msg: $scope.uploader.queue.length + ' Files Successfully Uploaded'});
		        }
		        //$scope.alerts.push({type:'danger', msg: 'Files Rejected'});

		        $scope.uploader.clearQueue();
		        loadAllUploads();
		      };*/
		      
		      /**
		       * @ngdoc method
		       * @name loadAllUploads
		       * @methodOf controller:
		       * @description Loads all uploads
		       */
		       /*var loadAllUploads = function(){
		         if($scope.loading){return;}

		         $scope.loading = true;
		         $scope.offset = 0;

		         var params = {
		           pageIndex: 0,
		           maxResults: $scope.limit,
		           enablePaging: true
		         };

		         if($scope.sortField !== ''){
		           params.sortBy = $scope.sortField;
		           params.sortDescending = !$scope.sortAscending;
		         }

		         //$scope.loading = true;
		        // FileMonitor.query(params).$promise.then(setUploads);
		         
		       }; */
    
  }
})();
