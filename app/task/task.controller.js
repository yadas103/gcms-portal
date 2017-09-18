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

  TaskController.$inject = ['$rootScope','$scope','$filter','Task'];

  
  function TaskController($rootScope, $scope,$filter,Task){
	  
	  console.log("Inside controller");
	 
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
