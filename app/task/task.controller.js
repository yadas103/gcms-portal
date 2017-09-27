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

  TaskController.$inject = ['$rootScope','$scope','$filter','Task','FileUploader','FileMonitor','localeMapper','LoggedUserDetail'];

  
  function TaskController($rootScope, $scope,$filter,Task,FileUploader,FileMonitor,localeMapper,LoggedUserDetail){
	  
	  console.log("Inside controller");
	  

		$scope.add = function(newValue) {
			var obj = {};
			obj.Name = newValue;
			obj.Value = newValue;
			$scope.Groups.push(obj);
			$scope.group.name = obj;
			$scope.newValue = '';
		}

		$scope.Groups = [ {
			Name : 'Wrong Name selected',
			Value : 'd1'
		}, {
			Name : 'Event cancelled',
			Value : 'A2'
		}, {
			Name : 'No Payment',
			Value : 'c3'
		}, {
			Name : 'Other reason',
			Value : 'new'
		} ];
		$scope.group = {
			name : ""
		}
      
	  
	  /**
		 * selim
		 * 
		 * @ngdoc method
		 * @name value
		 * @methodOf this method used for getting logged in user details
		 * @description Gets data
		 * 
		 * var getloggedUserData = function(){ return
		 * LoggedUserDetail.query().$promise.then(function(l){ $scope.loggeduser =
		 * l.userProfiles[0]; }); };
		 */	  
	  
	  
 	  
	  /**
	   	 * selim 
	     * @ngdoc method
	     * @name value
	     * @methodOf this method used for DLU-P/T excel generation
	     * @description Gets data
	     */
	  $scope.dldata=[];
	  $scope.value=function(con){            
		  con['AddressType']='primary Address';
		  con['Source System Code[P]']='DLU-P-GCMS';
		  con['Source System Code[T]']='DLU-T-GCMS';
		  con['Transaction Comments']='Consent update from GCMS';
	      $scope.dldata = [con];
	  }
	 
	  /**
	     * selim
	     * @name getTaskData
	     * @methodOf 
	     * @description Gets data
	     */
      
	  var getTaskData = function(){
		    
		     return Task.query().$promise.then(function(task){
		       $scope.TaskAttributes = task;
		       console.log(task);
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

        url: '../gcms-service/' + $scope.locale + '/bulk-upload',
       
      });   
      $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
      $scope.upload = function() {
   	   console.log("Inside upload");
          //if ($scope.uploader.queue.length > 0) {
       	   return FileMonitor.query().$promise.then(function(result){
   		       $scope.Result = result;
   		       $scope.alerts.push({type:'success', msg: $scope.uploader.queue.length + ' File(s) Processing Successful'});
   		       $scope.uploader.clearQueue();
   		       console.log(result)		       
   		      });
   		//  };
            
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
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.deleted = 'true';
					con.taskstatus = "DELETED";
					con.deleteReason = item.deleteReason;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.updatedDate = new Date();
				}
			});
			Task.update({
				id : item.id
			}, item);
		};
		$scope.updateReassign = function(item) {
			console.log("Inside updateReassign function");
			console.log(item.id);
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.assignedto = item.assignedto;
				}
			});
			Task.update({
				id : item.id
			}, item);
		};

		$scope.updateUnDelete = function(item) {
			console.log("Inside updateDelete function");
			console.log(item.id);
			angular.forEach($scope.TaskAttributes, function(con) {
				if (con.id === item.id) {
					con.deleted = 'false';
					con.taskstatus = "INCOMPLETED";
					con.deleteReason = item.deleteReason;
					con.deleteReasonDesc = item.deleteReasonDesc;
					con.updatedDate = new Date();
				}
			});
			Task.update({
				id : item.id
			}, item);
		};
		 	          
		 
		 $scope.$on('$localeChangeSuccess', getTaskData);
		   
		   
		  
    
  }
})();
