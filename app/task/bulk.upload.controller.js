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
    .controller('BulkCtrl',BulkUploadController);

  BulkUploadController.$inject = ['$rootScope','$scope','FileUploader','FileMonitor','localeMapper','toasty' ];

  
  function BulkUploadController($rootScope, $scope,FileUploader,FileMonitor,localeMapper,toasty ){
	  
	  console.log("Inside Bulk Upload controller");      
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
   	   $scope.a=false;
          //if ($scope.uploader.queue.length > 0) {
   	   $scope.success='';
 	   $scope.error='';
       	   return FileMonitor.query().$promise.then(function(result){
   		       $scope.Result = result;
   		       $scope.a=result.$resolved
   		    toasty.success({
    	        title: 'Success',
    	        msg: 'File Processed ! See results',
    	        showClose: true,
    	        clickToClose: true,
    	        timeout: 15000,
    	        sound: false,
    	        html: false,
    	        shake: false,
    	        theme: 'bootstrap'
    	      });
   		      // $scope.alerts.push({type:'success', msg: $scope.uploader.queue.length + 'File(s) Processing Successful'});
   		       $scope.uploader.clearQueue();
   		       console.log(result)		       
   		      }).catch(function(){
     		    	$scope.uploader.clearQueue(); 
     		    	toasty.error({
   			          title: 'Error',
   			          msg: 'File(s) proccessing failed ! Tessaract Error',
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
	  
    
  }
})();
