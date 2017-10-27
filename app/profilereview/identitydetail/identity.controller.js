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

  IdentityController.$inject = ['IdentityRequestView','$scope','$rootScope','$state','$stateParams','ValidatedProfile','LoggedUserDetail'];

  function IdentityController(IdentityRequestView,$scope,$rootScope,$state,$stateParams,ValidatedProfile,LoggedUserDetail){
	  
	  
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
      /**
       * @ngdoc method
       * @name close
       * @description used for Ok on Approve and reject Pop up Screen 
       * @param {object}
       *            item IdentityRequest object
       */
      $scope.close=function(item){
    	 }
      /**
       * @ngdoc method
       * @name updateApprove
       * @description used to Approve the ProfileRequest   after Validation is Done 
       * @param {object}
       *            item IdentityRequest object
       */
        $scope.updateApprove = function(item) {
        	if(item.notes==="Validated")
        	{
        		 item.status="Approve";
            	 item.updatedDate = new Date();
            	 item.notes=""
            	
        	}else{
        		item.bpid="";
        		item.notes=""
        	}

           IdentityRequestView.update({ id:item.id },item);
          };
          
          /**
           * @ngdoc method
           * @name updateDismiss
           * @description used to Reject  the ProfileRequest   after Validation is Done 
           * @param {object}
           *            item IdentityRequest object
           */
          
          $scope.updateDismiss = function(item) {
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
       * @name validate
       * @description validate bpid entered in the TextBox in approve and reject pop up screen 
       */
      
      $scope.validate = function(item){     	
    	  var id  ={id:item.bpid};
    	  ValidatedProfile.get(id).$promise
           .then(function(result) {
               if(result.$promise.$$state.status == 1)
           	{
            	   {
               		item.notes="Validated";
               	}
               	
               	}
              
             }).catch(function(){
          	  
            	 item.notes=" Not Validated";

             }); 
       };   
}
 
})();
