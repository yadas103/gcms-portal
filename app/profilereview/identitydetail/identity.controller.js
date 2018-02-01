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

  IdentityController.$inject = ['IdentityRequestView','$scope','$rootScope','$http','Users','UIConfig','EmailGeneration','$state','$stateParams','ValidatedProfile','toasty'];

  function IdentityController(IdentityRequestView,$scope,$rootScope,$http,Users,UIConfig,EmailGeneration,$state,$stateParams,ValidatedProfile,toasty){
	 $scope.itemsByPage=10;
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
	     
	   
	      UIConfig.query().$promise.then(function(result){
	        	$scope.configFile = result;	        	
	        });
	      
	     // $scope.records={};
	      $scope.records='';
	      $scope.recordlength='';
	      var loadIdentityRequestView = function(){			  
	    	  IdentityRequestView.query().$promise
              .then(function(result){
                  		   $scope.identityRequestView = result; 
                  		 $scope.status='True';                  		
                  		$scope.recordlength=$scope.identityRequestView.length;
                  		 if ($scope.identityRequestView.length=='0'){                 			
                  			$scope.status='True';
        					$scope.records="No records to show";
                  		 }
                     	}).catch(function(){
        				//$scope.responseOnSearch = "No records to show"
        					$scope.status='True';
        					$scope.records="No records to show";
        					//$scope.profileSearchCopy.length = 0;                               	
        				});
              };
	  		  
  

      loadIdentityRequestView();
      $scope.displayedCollection = [].concat($scope.identityRequestView);
     
      var updateUsers = function(result){
          $scope.user = result;
        };
	  
        var loadUsers = function(){
          $scope.user = [];
          Users.query().$promise.then(updateUsers);
        };

        loadUsers();

        $scope.$on('$localeChangeSuccess', loadUsers);
        
      
      
      var currentprofile = $rootScope.currentProfile;
      $scope.logged_In_User= currentprofile.userName;
     /* *//**
      * @ngdoc method
      * @name update
      * @description Updates IdentityRequest status
      * @param {object}
      *            item IdentityRequest object
      *//*
      $scope.update = function(identityRequestView) {
            $scope.identityRequestView = identityRequestView;
            IdentityRequestView.update({
                  id : item.id
            }, item);
      };*/
      /** 
       * @ngdoc method
       * @name close
       * @description used for Ok on Approve and reject Pop up Screen 
       * @param {object}
       *            item IdentityRequest object
       */
      $scope.close=function(item){
    	  
    	 }
    //sending parameters for status
      var params={};
      $scope.request={};
      $scope.request.downchk='Pending';
      $scope.identityRequestView=[];
      $scope.column=false;
        $scope.onCategoryChange= function(request){
        	$scope.records='';
      	params=request.downchk;
      	var data = {"id":"","status":""};
      	data.status=params;
      	data.id = (params.id!== undefined && params.id!== "" ) ? params.id: 'id';
      	 IdentityRequestView.get(data).$promise
            .then(function(result){
            	if(result.$promise.$$state.status == 1)
            	{ 
            		$scope.identityRequestView = result; 
                		   $scope.displayedCollection = [].concat($scope.identityRequestView);
                		   $scope.recordlength=$scope.identityRequestView.length;
            	
            	if($scope.identityRequestView[0].status=='Pending'){
            		$scope.status='True';
            	}else if ($scope.identityRequestView.length=='0')
				{
            		$scope.status='True';
				}else{
					$scope.status='False';
				}
            	}
                   	}).catch(function(){
        				//$scope.responseOnSearch = "No records to show"
        					$scope.status='True';
        					$scope.records="No records to show";
        					//$scope.profileSearchCopy.length = 0;                               	
        				}); ;
        }

      /**
       * @ngdoc method
       * @name validate
       * @description validate bpid entered in the TextBox in approve and reject pop up screen 
       */
      $scope.trData=[];
      $scope.validation='';
      $scope.validate = function(item){ 
    	   
    	  $scope.validation='';
    	  var id  ={id:item.bpid};
    	  ValidatedProfile.get(id).$promise
           .then(function(result) {
               if(result.$promise.$$state.status == 1)
           	{
            	   {
            		   $scope.trData=result;            	
            		   $scope.validation="true";
            		   $scope.success="TR ID is valid,Please Approve or Reject "
               	}
               	
               	}
              
             }).catch(function(){
          	  
            	 $scope.validation="false";
            	 $scope.error="TR ID is not valid,Please verify!"
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
          	console.log("Yes");
          }
          else
          	{
          	console.log("No");
          	}
         
        });
		};
		var currentprofile = $rootScope.currentProfile;
		$scope.logged_In_User= currentprofile.userName;
		$scope.getSenderDetails = function(reqID){
	  	  	 var  emailTo = 'emailTo';
	 	    	 var  emailFrom = 'emailFrom';
	 	    	 var  message = 'message';
	 	    	 var  emailCC = 'emailCC';
	 	    	 var  requestID = 'requestID';
	 	    	 var  subject = 'subject';
	 	    	 var emaildetails = {};
	 	    	 var resultcontent = {};
	 	    	 var fn = ($scope.resultcopy.firstName == null)? 'N/A' : $scope.resultcopy.firstName;
	  		 var ln = ($scope.resultcopy.lastName == null)? 'N/A' : $scope.resultcopy.lastName;
	  		 var on = ($scope.resultcopy.organizationName == null)? 'N/A' : $scope.resultcopy.organizationName;	        		    	
	  		 var city = ($scope.resultcopy.city == null)? 'N/A' : $scope.resultcopy.city ;  
	  		var speciality =  ($scope.resultcopy.speciality == null)? 'N/A' : $scope.resultcopy.speciality ;
	  		 //var notes = ($scope.resultcopy.notes == null)? '' : $scope.resultcopy.notes;
	  		 var status = ($scope.resultcopy.status == null)? '' : $scope.resultcopy.status;
	          // $scope.profileRequestSender = $scope.resultcopy.createdBy; 
	  		 $scope.reviewerFullName = currentprofile.firstName+" "+currentprofile.lastName;	        
	          
	          for(var i in $scope.user){
					if ($scope.user[i].userName == $scope.profileRequestSender){
						$scope.requestorFirstName = $scope.user[i].firstName;    
					}				
				} 
	          				  				     
			     if( $scope.configFile.emailTo != ""){
						$scope.emaildetails[emailTo] = $scope.configFile.emailTo; 
						$scope.emaildetails[emailFrom] = $scope.configFile.emailFrom; 
					}
					else {
						$scope.emaildetails[emailTo] = $scope.profileRequestSender;
						$scope.emaildetails[emailFrom] = $scope.configFile.emailFrom;
					}
			     
			    	$scope.msgRequestor = $scope.configFile.msgRequestor;
			    	$scope.msgRequestor = $scope.msgRequestor.replace("REQUESTOR_FIRST_NAME",$scope.requestorFirstName);
					$scope.msgRequestor = $scope.msgRequestor.replace(new RegExp("REVIEWER_FULL_NAME", 'g'),$scope.reviewerFullName);
					$scope.msgRequestor = $scope.msgRequestor.replace(new RegExp("PROFILE_TYPE", 'g'),$scope.profile_type_id);
					$scope.msgRequestor = $scope.msgRequestor.replace("FIRST_NAME",fn);
					$scope.msgRequestor = $scope.msgRequestor.replace("LAST_NAME",ln);
					$scope.msgRequestor = $scope.msgRequestor.replace("ORGANIZATION_NAME",on);
					$scope.msgRequestor = $scope.msgRequestor.replace("SPECIALTY",speciality);
					$scope.msgRequestor = $scope.msgRequestor.replace("CITY",city);
					$scope.msgRequestor = $scope.msgRequestor.replace(new RegExp("COUNTRY", 'g'),$scope.countryCopy);
					$scope.msgRequestor = $scope.msgRequestor.replace("ADDRESS",$scope.resultcopy.address);
					$scope.msgRequestor = $scope.msgRequestor.replace("REQUESTOR",$scope.profileRequestSender);
					$scope.msgRequestor = $scope.msgRequestor.replace("REVIEWER_EMAIL_ADDRESS",currentprofile.userName);
					
					$scope.emaildetails[message] = $scope.msgRequestor;
			     
			     
		        $scope.emaildetails[requestID] = $scope.logged_In_User;
			    	$scope.emaildetails[subject] = "GCMS - "+$scope.profile_type_id+" Profile Review Status for "+$scope.countryCopy;
			    	emaildetails = $scope.emaildetails;
			    	$scope.generateEmail(emaildetails);			           			    	
			  
	  	          };
	      
  	 /**
       * @ngdoc method
       * @name updateApprove
       * @description used to Approve the ProfileRequest   after Validation is Done 
       * @param {object}
       *            item IdentityRequest object
       */
       
  	          
        $scope.updateApprove = function(item) {
        	
        	if( $scope.validation=='true')
        		
        	{
        		
        		 item.status="Approved";
            	 item.updatedDate = new Date();
            		 var reqID = {};
            	 reqID = item.id;
            	  
               	$scope.resultcopy = $scope.trData[0];
               	$scope.resultcopy.status=item.status;
               	$scope.resultcopy.organizationName=$scope.trData[0].organisationName;
               	$scope.profile_type_id =$scope.trData[0].profileType;
            	$scope.countryCopy = $scope.trData[0].country;
            	 var Createdby=item.createdBy;
           	  var index = Createdby.indexOf("(");
       			var startIndex = Createdby.indexOf("(");
       			var endIndex = Createdby.indexOf(")");
       			var ntidUser = Createdby.substring(startIndex + 1, endIndex);
       			$scope.profileRequestSender = ntidUser;   
              // 	$scope.resultcopy = item;
               	$scope.getSenderDetails(reqID);
               	$scope.profile_status= item.status;
               	$scope.TRID=item.bpid;
               	
        	}else{
        		item.bpid="";
        	}

           IdentityRequestView.update({ id:item.id },item).$promise.then(function(response){
         	if(response.$promise.$$state.status==1){ 
         		
           	if($scope.profile_status=="Approved"){
           		toasty.success({
           	        title: 'Success',
           	        msg: 'Status : Approved ',
           	        showClose: true,
           	        clickToClose: true,
           	        timeout: 5000,
           	        sound: false,
           	        html: false,
           	        shake: false,
           	        theme: 'bootstrap'
           	      })};
           		$scope.ok(item);
           		loadIdentityRequestView();
                $scope.displayedCollection = [].concat($scope.identityRequestView);
         	}
         	
		      }).catch(function(){
		    	 
	 		    	 internalError();
	 		    	 
	       		 });
           //$state.reload();
          };
          
          /**
           * @ngdoc method
           * @name updateDismiss
           * @description used to Reject  the ProfileRequest   after Validation is Done 
           * @param {object}
           *            item IdentityRequest object
           */
          
          $scope.updateDismiss = function(item) {
       	if($scope.validation=='true')
       	{
       		 item.status="Rejected";
           	 item.updatedDate = new Date();
           		var reqID = {};
        	 reqID = item.id;
          	$scope.resultcopy = $scope.trData[0];
          	$scope.resultcopy.status=item.status;
          	$scope.resultcopy.organizationName=$scope.trData[0].organisationName;
          	$scope.profile_type_id =$scope.trData[0].profileType;
       	$scope.countryCopy = $scope.trData[0].country;
        var Createdby=item.createdBy;
     	  var index = Createdby.indexOf("(");
 			var startIndex = Createdby.indexOf("(");
 			var endIndex = Createdby.indexOf(")");
 			var ntidUser = Createdby.substring(startIndex + 1, endIndex);
 			$scope.profileRequestSender = ntidUser; 
          	$scope.getSenderDetails(reqID);
          	$scope.profile_status= item.status;
          	$scope.TRID=item.bpid;
           	
       	}
       	else{
    		item.bpid="";
    	}
         	IdentityRequestView.update({ id:item.id }, item).$promise.then(function(response){
           	if(response.$promise.$$state.status==1){	
          
         	if($scope.profile_status=="Rejected"){
           		toasty.success({
           	        title: 'Success',
           	        msg: 'Status : Rejected',
           	        showClose: true,
           	        clickToClose: true,
           	        timeout: 5000,
           	        sound: false,
           	        html: false,
           	        shake: false,
           	        theme: 'bootstrap'
           	      })
           	   $scope.ok(item);
         	}
         	};
           		
           		
           	
		      }).catch(function(){
		    	  //(); 
	 		    	 internalError();	
	       		 });
          };
      
  
  }
 
})();
