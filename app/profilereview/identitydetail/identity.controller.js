/**
 * @ngdoc overview
 * @name gcms.IdentityRequest
 *
 * @description
 * Represents a IdentityRequestView controller.
 */
(function () {
  'use strict';

  angular
    .module('gcms.identity')
    .controller('identityCtrl', IdentityController);

  IdentityController.$inject = ['IdentityRequestView','$scope','$rootScope','$state','$stateParams','Profile1','LoggedUserDetail'];

  function IdentityController(IdentityRequestView,$scope,$rootScope,$state,$stateParams,Profile1,LoggedUserDetail){
	  
	  
	  console.log("Inside identitycontroller");

      var updateIdentityRequestView = function(result) {
            $scope.identityRequestView = result;
      };

      var loadIdentityRequestView = function() {
            $scope.identityRequestView = [];
            
            IdentityRequestView.query().$promise
                        .then(updateIdentityRequestView);
           
      };

      loadIdentityRequestView();
     
      $scope.displayedCollection = [].concat($scope.identityRequestView);

      $scope.$on('$localeChangeSuccess', loadIdentityRequestView);

      /**
      * @ngdoc method
      * @name update
      * @methodOf gcms.landing.directive:gcmsIdentityRequest
      * @description Updates IdentityRequest status
      * @param {object}
      *            item IdentityRequest object
      */
      $scope.update = function(identityRequestView) {
            $scope.identityRequestView = identityRequestView;
            IdentityRequestView.update({
                  id : item.id
            }, item);
      };
      $scope.close=function(item){
    	  console.log("Inside close",item);
    	 }
      
        $scope.updateApprove = function(item) {
        	console.log("inside updateApprove");
        	 console.log($scope.profile1);
        	 var ide=$scope.profile1;
        	 console.log(item.status);
        	if(item.notes==="Validated")
        	{
        		 item.status="Approve";
            	 item.updatedDate = new Date();
            	 item.notes=""
            	
        	}else{
        		item.bpid="";
        		item.notes=""
        	}
        	
        	
      	  console.log("Inside updateApprove");
      	  console.log(item);
            //angular.forEach($scope.identityRequest, function(identity){
            	
            	
                
          //  });
            	 IdentityRequestView.update({ id:item.id },item);
          };
          
          
          
          $scope.updateDismiss = function(item) {
          	 console.log("Inside updateDismiss");
          	console.log($scope.profile1);
       	 var ide=$scope.profile1;
       	if(item.notes==="Validated")
       	{
       		 item.status="Reject";
           	 item.updatedDate = new Date();
           	 item.notes=""
       	}
       	else{
    		item.bpid="";
    		item.notes=""
    	}
         	IdentityRequestView.update({ id:item.id }, item);
          };
      /**
       * @ngdoc method
       * @name ok
       * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
       * @description
       * Closes the modal and returns the item
       */
      /*$scope.ok = function (identityRequest) {
        $scope.identityRequest  = (typeof identityRequest === 'undefined') ? $scope.identityRequest : identityRequest;
        $uibmodalInstance.close($scope.identityRequest);
      };*/

      /**
       * @ngdoc method
       * @name cancel
       * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
       * @description
       * Dismisses the modal
       */
      /*$scope.cancel = function () {
        $uibmodalInstance.dismiss('cancel');
      };*/
      // populate $scope request property
      /*if ($scope.criteria !== undefined){
        $scope.item = $scope.criteria;
      }
      console.log('$scope.criteria'+$scope.criteria);
      $scope.source = $scope.source || 'app/profilereview/identitydetail/identityProfile.html';

      
      $scope.uploadtest = function () {
    	  alert("in uploadtest 22");
    	  console.log("uploadtest 22***");
      };*/
      
      /**
       * @ngdoc method
       * @name submit
       * @methodOf trs.recipient.directive:trsRecipientSearch
       * @description Builds criteria and submits recipient search form
       */
      
      $scope.validate = function(item){   
     	
    	  var id  ={id:item.bpid};
    	  Profile1.get(id).$promise
           .then(function(result) {
               if(result.$promise.$$state.status == 1)
           	{
            	   {
               		item.notes="Validated";
               		console.log(item.notes);
               	}
               	
               	}
              
             }).catch(function(){
          	  
            	 item.notes=" Not Validated";
         		console.log(item.notes);
           	   
           	   
             }); 
       };
      /*$scope.validateDismiss = function(item) {
       	 console.log("Inside ValidateDismiss");
         console.log(item.id);
         var id  ={id:item.bpid};
         console.log(id);
       var updateProfile1= function(result) {
             $scope.profile1 = result;
            // item.bpid="";
             console.log( $scope.profile1);
             var ide=$scope.profile1;
         	if(ide!=0)
             
         	{
         		item.status=" Validated";
         	}
            else {
         		item.status=" not Validated";
         	}
             
       };
 		  var getDataProfile = function() {
 	            $scope.profile1 = [];
 	            
 	            Profile1.get(id).$promise
 	                        .then(updateProfile1);
 	           
 	      };
 	     
 	      getDataProfile();
 		  console.log("hiiiii");
 		  item.status="";
 	  $scope.$on('$localeChangeSuccess', getDataProfile);
 	 console.log($scope.profile1);
 	
    alert($scope.profile1);
   
       };*/
}



	 	          
	          
	          // $scope.$on('$localeChangeSuccess', getData);
		   
		   
		
  
})();
