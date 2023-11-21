/**
 * @ngdoc overview
 * @name gcms.admin
 * @author: selim
 * @description Represents a admin controller.
 */
(function () {
  'use strict';


  angular
    .module('gcms.pre-administration')
    .controller('ReviewCtrl', RiviewController);

  RiviewController.$inject = ['$rootScope','$scope','Review','Users','toasty'];

  
  function RiviewController($rootScope, $scope,Review,Users,toasty){
	  
	  console.log("Inside Riview controller");
	    
	  Users.query().$promise.then(function(resp){
	       $scope.Users = resp;
	      });
	    
	  var hasDuplicate = function(data) {
		    for (var i = 0; i < data.length; i++) {
		      for (var x = i + 1; x < data.length; x++) {
		        if (data[i] == data[x]) {
		          
		          $scope.error="Sorry,there is dupliacate entry ! "+data[x];
		          return true;
		          
		        }
		      }
		    }
		    return false;
		    
		  };
		  
	  $scope.array=[];
	  $scope.update = function(item) {			
			 console.log("Inside update function of revier controller");
			console.log( item.cntryReviewer);
			$scope.error='';
			 if(item.cntryReviewer.endsWith(';')){
				 item.cntryReviewer = item.cntryReviewer.substr(0, item.cntryReviewer.length - 1);
		    	}else{
		    		// item.cntryReviewer=item.cntryReviewer+";"
		    		// item.cntryReviewer = item.cntryReviewer.substr(0,
					// item.cntryReviewer.length - 1);
		    	}			  	
		    	$scope.array = item.cntryReviewer.split(';');	
		    	$scope.array = String.prototype.toUpperCase.apply($scope.array).split(",");

		    	$scope.a=hasDuplicate($scope.array);
		    	
		    	if(!$scope.a){
		    	
		    	$scope.countuser=1;
		    	$scope.countgg=1;
		    	angular.forEach($scope.array, function(user) {
		    	    angular.forEach($scope.Users, function(con) {
		    	    	
		    	    	if(angular.lowercase(user)===angular.lowercase(con.userName)) {
		    	    		$scope.countuser=$scope.countuser+1;
		    	    		console.log("string -->"+$scope.countuser);		    	    		
		    	    	}
		    	    	
		    	    });			    	    
		    	    if($scope.countuser==$scope.countgg){
		    	    	console.log("failed user"+user);
		    	    	$scope.error="Please verify reviewer(ID),which is provided "+user;
		    	    }else{
		    	    	$scope.countgg=$scope.countgg+1;
		    	    	// console.log("success"+user);
		    	    }
		    	});
		    	if($scope.array.length===$scope.countuser-1){
		    		$scope.error='';
		    		angular.forEach($scope.ReviewAttributes, function(con){
			            console.log(con);	
			         if (con.id === item.id) {
			           con.countries.id=item.countries.id;
			           console.log(con.id);
			           con.updatedDate = new Date();      
			              }
			            });
		    		console.log(item);
		    		delete item.expanded;
		    	   Review.update({ id:item.id }, item).$promise.then(function(response){
		    			toasty.success({
	            	        title: 'Success',
	            	        msg: 'Data Updated!',
	            	        showClose: true,
	            	        clickToClose: true,
	            	        timeout: 5000,
	            	        sound: false,
	            	        html: false,
	            	        shake: false,
	            	        theme: 'bootstrap'
	            	      });
		    				$scope.getProfileReviewerPersmission;		    				
		    				$scope.ok(item);
		    				
		    		}).catch(function(){		 		    	
		    			toasty.error({
			      	          title: 'Error',
			      	          msg: 'Internal server error',
			      	          showClose: true,
			      	          clickToClose: true,
			      	          timeout: 5000,
			      	          sound: false,
			      	          html: false,
			      	          shake: false,
			      	          theme: 'bootstrap'
			      	        });	
		       		  });
		    		// console.log("Update");
	    	    }
		    	
		    	
		    	}
	          };
	 
  }
	 
})();
