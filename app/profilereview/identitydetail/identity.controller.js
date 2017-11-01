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

  IdentityController.$inject = ['IdentityRequestView','$scope','$rootScope','$http','EmailGeneration','$state','$stateParams','ValidatedProfile','LoggedUserDetail'];

  function IdentityController(IdentityRequestView,$scope,$rootScope,$http,EmailGeneration,$state,$stateParams,ValidatedProfile,LoggedUserDetail){

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
       * @name validate
       * @description validate bpid entered in the TextBox in approve and reject pop up screen 
       */

      $scope.validation=" Not Validated";
      $scope.validate = function(item){     	
    	  var id  ={id:item.bpid};
    	  ValidatedProfile.get(id).$promise
           .then(function(result) {
               if(result.$promise.$$state.status == 1)
           	{
            	   {
            		   $scope.validation="Validated";
               	}
               	
               	}
              
             }).catch(function(){
          	  
            	 $scope.validation=" Not Validated";

             }); 
       }; 
     
      
      $scope.emaildetails = {};
       $scope.countryCopy = {};
      $scope.profile_type_id = {};
      $scope.profileRequestSender = {};
      $scope.resultcopy = {};
      $scope.profile_status={};
      $scope.TRID={};
     
      $scope.generateEmail = function(emaildetails){
      	EmailGeneration.save(emaildetails).$promise
      .then(function(response) {
          if(response.$promise.$$state.status == 1)
      	{
          	console.log(response);
          }
          else
          	{
          	console.log(response);
          	}
         
        });
		};

		 LoggedUserDetail.query().$promise
         .then(function(loggedInUser) {
           $scope.logged_In_User = loggedInUser;  
         });
  	$scope.getSenderDetails = function(reqID){
  	  	 var  emailTo = 'emailTo';
 	    	 var  emailFrom = 'emailFrom';
 	    	 var  message = 'message';
 	    	 var  emailCC = 'emailCC';
 	    	 var  requestID = 'requestID';
 	    	 var  subject = 'subject';
 	    	 var emaildetails = {};
 	    	 var resultcontent = {};
 	    	 var fn = ($scope.resultcopy.firstName == null)? '' : $scope.resultcopy.firstName;
  		 var ln = ($scope.resultcopy.lastName == null)? '' : $scope.resultcopy.lastName;
  		 var on = ($scope.resultcopy.organizationName == null)? '' : $scope.resultcopy.organizationName;	        		    	
  		 var city = ($scope.resultcopy.city == null)? '' : $scope.resultcopy.city ;       		    	
  		 var notes = ($scope.resultcopy.notes == null)? '' : $scope.resultcopy.notes;
  		 var status = ($scope.resultcopy.status == null)? '' : $scope.resultcopy.status;
           $scope.profileRequestSender = $scope.resultcopy.createdBy;             
             
		$http.get('./emailproperties.json').then(function (response) {
		  console.log(response);
		     if( response.data.production.value === 'yes'){
		    	 
		    	 $scope.emaildetails[emailTo] = $scope.profileRequestSender; 
		    	 $scope.emaildetails[emailFrom] = $scope.logged_In_User.userName; 
		     }
		     else if(response.data.development.value === 'yes'){
		    	 
		    	$scope.emaildetails[emailTo] = response.data.development.emailTo;
			    $scope.emaildetails[emailFrom] = response.data.development.emailFrom;
		     }
		     else if(response.data.testing.value === 'yes'){
		    	 
		    	$scope.emaildetails[emailTo] = response.data.testing.emailTo;
			    $scope.emaildetails[emailFrom] = response.data.testing.emailFrom;
		     }
		     if(fn != ''){
		    	 if($scope.profile_status=="Approve"){
		     $scope.emaildetails[message] = "This is to inform you that the below profile creation request has been submitted to me to review.<br/>"+
		    	"<br/>"+"has been " + $scope.profile_status+" with below Details: " + "<br/>"+
		    	"First Name: "+fn+"<br/>"+
		    	"<br/>"+
		    	"Last Name: "+ln+"<br/>"+
		    	"<br/>"+
		    	"Address: "+$scope.resultcopy.address+"<br/>"+
		    	"<br/>"+
		    	"City: "+city+ "<br/>"+
		    	"<br/>"+
		    	"Specility: "+$scope.resultcopy.specility+"<br/>"+
		    	"<br/>"+
		    	"Status: "+$scope.profile_status+"<br/>"+
		    	"<br/>"+
		    	"TRID: "+$scope.TRID+"<br/>"+
		    	"<br/>"+
		    	"Thanks and Regards<br/>"+
		    	"GCMS Application Support<br/>"+
		    	"<br/>"+
		    	"<br/>"+
		    	"This email was auto-generated by the GCMS System. Please do not reply to this email. If you need support with the GCMS Application, please raise a request for GCMS Support using the following Link<br/>";
		         }
		    	 else if ($scope.profile_status=="Reject"){
		    		 $scope.emaildetails[message] = "This is to inform you that the below profile creation request has been submitted to me to review has been "+
				    	"<br/>"+ $scope.profile_status+" with below Details: "+ "<br/>"+
				    	"First Name: "+fn+"<br/>"+
				    	"<br/>"+
				    	"Last Name: "+ln+"<br/>"+
				    	"<br/>"+
				    	"Address: "+$scope.resultcopy.address+"<br/>"+
				    	"<br/>"+
				    	"City: "+city+ "<br/>"+
				    	"<br/>"+
				    	"Specility: "+$scope.resultcopy.specility+"<br/>"+
				    	"<br/>"+
				    	"Status: "+$scope.profile_status+"<br/>"+
				    	"<br/>"+
				    	"TRID: "+$scope.TRID+"<br/>"+
				    	"<br/>"+
				    	"Please search with above TRID to find the record "+
				    	"<br/>"+
				    	"<br/>"+
				    	"Thanks and Regards<br/>"+
				    	"GCMS Application Support<br/>"+
				    	"<br/>"+
				    	"<br/>"+
				    	"This email was auto-generated by the GCMS System. Please do not reply to this email. If you need support with the GCMS Application, please raise a request for GCMS Support using the following Link<br/>";
				         }
		     }
		     else if(on != ''){
  		    
  		    	 if($scope.profile_status=="Approve"){
  		    		 $scope.emaildetails[message] = "To: "+ $scope.profileRequestSender+"<br/>"+
  	  		    	"CC: "+$scope.logged_In_User.userName+"<br/>"+
  	  		    	"<br/>"+
  				     "This is to inform you that the below profile creation request has been submitted to me to review.<br/>"+
  				    	"<br/>"+"has been " + $scope.profile_status+" with below Details: " + "<br/>"+
  		    	"Organization Name: "+on+"<br/>"+
  		    	"<br/>"+
  		    	"Address: "+$scope.resultcopy.address+"<br/>"+
		    	"<br/>"+
		    	"City: "+city+ "<br/>"+
		    	"<br/>"+
		    	"Specility: "+$scope.resultcopy.specility+"<br/>"+
		    	"<br/>"+
		    	"Status: "+$scope.profile_status+"<br/>"+
		    	"<br/>"+
		    	"TRID: "+$scope.TRID+"<br/>"+
		    	"<br/>"+
		    	"Thanks and Regards<br/>"+
		    	"GCMS Application Support<br/>"+
		    	"<br/>"+
		    	"<br/>"+
		    	"This email was auto-generated by the GCMS System. Please do not reply to this email. If you need support with the GCMS Application, please raise a request for GCMS Support using the following Link<br/>";
		         }
  		    	 else if ($scope.profile_status=="Reject"){
  		    		 $scope.emaildetails[message] = "To: "+ $scope.profileRequestSender+"<br/>"+
  	  		    	"CC: "+$scope.logged_In_User.userName+"<br/>"+
  	  		    	"<br/>"+
		    		"This is to inform you that the below profile creation request has been submitted to me to review has been "+
				    	"<br/>"+ $scope.profile_status+" with below Details: "+ "<br/>"+
				    	"Organization Name: "+on+"<br/>"+
		  		    	"<br/>"+
		  		    	"Address: "+$scope.resultcopy.address+"<br/>"+
				    	"<br/>"+
				    	"City: "+city+ "<br/>"+
				    	"<br/>"+
				    	"Specility: "+$scope.resultcopy.specility+"<br/>"+
				    	"<br/>"+
				    	"Status: "+$scope.profile_status+"<br/>"+
				    	"<br/>"+
				    	"TRID: "+$scope.TRID+"<br/>"+
				    	"<br/>"+
				    	"Please search with above TRID to find the record "+
				    	"<br/>"+
				    	"<br/>"+
				    	"Thanks and Regards<br/>"+
				    	"GCMS Application Support<br/>"+
				    	"<br/>"+
				    	"<br/>"+
				    	"This email was auto-generated by the GCMS System. Please do not reply to this email. If you need support with the GCMS Application, please raise a request for GCMS Support using the following Link<br/>";
				         }
		     }
		        $scope.emaildetails[requestID] = reqID;
		    	$scope.emaildetails[subject] = 'Request ID: '+reqID +' '+ $scope.profile_type_id +' Profile Review Request for '+$scope.countryCopy + ' has been ' +$scope.profile_status ;
		    	emaildetails = $scope.emaildetails;
		    	$scope.generateEmail(emaildetails);
		         });    			    	
		  
  	          };
      
  	 /**
       * @ngdoc method
       * @name updateApprove
       * @description used to Approve the ProfileRequest   after Validation is Done 
       * @param {object}
       *            item IdentityRequest object
       */
      
        $scope.updateApprove = function(item) {
        	
        	if( $scope.validation==="Validated")
        		
        	{
        		
        		 item.status="Approve";
            	 item.updatedDate = new Date();
            		 var reqID = {};
            	 reqID = item.id;
               	$scope.countryCopy = item.country;
               	$scope.profile_type_id = item.profileTypeId;
               	$scope.resultcopy = item;
               	$scope.getSenderDetails(reqID);
               	$scope.profile_status= item.status;
               	$scope.TRID=item.bpid;
        	}else{
        		item.bpid="";
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
       	if($scope.validation==="Validated")
       	{
       		 item.status="Reject";
           	 item.updatedDate = new Date();
           		var reqID = {};
        	 reqID = item.id;
           	$scope.countryCopy = item.country;
           	$scope.profile_type_id = item.profileTypeId;
           	$scope.resultcopy = item;
           	$scope.getSenderDetails(reqID);
           	$scope.profile_status= item.status;
           	$scope.TRID=item.bpid;
       	}
       	else{
    		item.bpid="";
    	}
         	IdentityRequestView.update({ id:item.id }, item);
          };
      
  
  }
 
})();
