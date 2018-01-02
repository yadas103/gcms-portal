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

  IdentityController.$inject = ['IdentityRequestView','$scope','$rootScope','$http','EmailGeneration','$state','$stateParams','ValidatedProfile','toasty'];

  function IdentityController(IdentityRequestView,$scope,$rootScope,$http,EmailGeneration,$state,$stateParams,ValidatedProfile,toasty){
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

	      $scope.status={};
	     // $scope.records={};
	      $scope.records='';
	      $scope.recordlength='';
	      var loadIdentityRequestView = function(){			  
	    	  IdentityRequestView.query().$promise
              .then(function(result){
                  		   $scope.identityRequestView = result; 
                  		 $scope.status='True';
                  		console.log("hiiiiii length"+ $scope.identityRequestView.length);
                  		$scope.recordlength=$scope.identityRequestView.length;
                  		 if ($scope.identityRequestView.length=='0'){
                  			 console.log("hiiiiii length"+ $scope.identityRequestView.length);
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
      
      $scope.identityRequestView=[];
      $scope.column=false;
        $scope.onCategoryChange= function(request){
        	$scope.records='';
      	params=request.downchk;
      	var data = {"id":"","status":""};
      	data.status=params;
      	data.id = (params.id!== undefined && params.id!== "" ) ? params.id: 'id';
      	console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiii");
      	 IdentityRequestView.get(data).$promise
            .then(function(result){
            	if(result.$promise.$$state.status == 1)
            	{ 
            		$scope.identityRequestView = result; 
                		   console.log("hii records"+result)
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
            		  /* console.log("fn"+$scope.trData[0].firstName);
            		   console.log("ls"+$scope.trData[0].lastName);
            		   console.log("on"+$scope.trData[0].organizationName);
            		   console.log("sp"+$scope.trData[0].specility);
            		   console.log("country"+$scope.trData[0].country);
            		   console.log("profiletype"+$scope.trData[0].profileType);
            		   console.log("onwith-s"+$scope.trData[0].organisationName);
            		   console.log("city"+$scope.trData[0].city);
            		   console.log("add"+$scope.trData[0].address);*/
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
          	console.log(response);
          }
          else
          	{
          	console.log(response);
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
 	    	 var fn = ($scope.resultcopy.firstName == null)? '' : $scope.resultcopy.firstName;
  		 var ln = ($scope.resultcopy.lastName == null)? '' : $scope.resultcopy.lastName;
  		 var on = ($scope.resultcopy.organizationName == null)? '' : $scope.resultcopy.organizationName;	        		    	
  		 var city = ($scope.resultcopy.city == null)? '' : $scope.resultcopy.city ;       		    	
  		 //var notes = ($scope.resultcopy.notes == null)? '' : $scope.resultcopy.notes;
  		 var status = ($scope.resultcopy.status == null)? '' : $scope.resultcopy.status;
          // $scope.profileRequestSender = $scope.resultcopy.createdBy;             
            
             
		$http.get('./emailproperties.json').then(function (response) {
		  console.log(response);
		     if( response.data.production.value === 'yes'){
		       $scope.emaildetails[emailTo] = $scope.profileRequestSender;
		    	 $scope.emaildetails[emailFrom] = $scope.logged_In_User;
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
		    	 if($scope.profile_status=="Approved"){
		     $scope.emaildetails[message] = "MailTo:  "+ $scope.profileRequestSender +"-<br/><br/><br/>"+
		    	 "This is to inform you that the below profile creation request has been " + $scope.profile_status+" with below Details: " + "<br/>"+
		    	"<br/>"+
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
		    	 else if ($scope.profile_status=="Rejected"){
		    		 $scope.emaildetails[message] = "MailTo:  "+ $scope.profileRequestSender +"-<br/><br/><br/>"+
		    		 "This is to inform you that the below profile creation request has been " + $scope.profile_status+" with below Details: " + "<br/>"+
				    	"<br/>"+
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
  		    
  		    	 if($scope.profile_status=="Approved"){
  		    		 $scope.emaildetails[message] = "MailTo:  "+ $scope.profileRequestSender +"-<br/><br/><br/>"+
  		    		"This is to inform you that the below profile creation request has been " + $scope.profile_status+" with below Details: " + "<br/>"+
  			    	"<br/>"+
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
  		    	 else if ($scope.profile_status=="Rejected"){
  		    		 $scope.emaildetails[message] = "To: "+ $scope.profileRequestSender+"<br/>"+
  	  		    	"CC: "+$scope.logged_In_User+"<br/>"+
  	  		    	"<br/>"+
  	  		    "This is to inform you that the below profile creation request has been " + $scope.profile_status+" with below Details: " + "<br/>"+
		    	"<br/>"+
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
           	console.log(response);
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
           	console.log(response);
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
