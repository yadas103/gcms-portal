/**
 * @ngdoc overview
 * @name gcms.admin
 * @author: selim
 * @description Represents a admin controller.
 */
(function () {
  'use strict';


  angular
    .module('gcms.administration')
    .controller('AdminCtrl', AdminController);

  AdminController.$inject = ['$rootScope','$scope','$state','localeMapper','Review','Templates','UserProfile', 'UserDetail', 'Role','$window','toasty'];

  
  function AdminController($rootScope, $scope,$state,localeMapper,Review,Templates,UserProfile, UserDetail, Role,$window,toasty){
	  
	  console.log("Inside Admin controller");
	    
	  
	  /**
		 * @author: selim
		 * @ngdoc internal error
		 * @name 
		 * @description show error message
		 */
	    
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
	    
		/**
		 * @author: selim
		 * @ngdoc method
		 * @name getData
		 * @description gets all review data one load
		 */
	  
	  	 var getReviewData = function(){		  
		   Review.query().$promise.then(function(review){		    	 
		       $scope.ReviewAttributes = review;		     
		       // console.log($scope.ReviewAttributes );
		       });
		  };
		  getReviewData();
	    
	    
	    
		  /**
			 * @author: selim
			 * @ngdoc method
			 * @name getdata
			 * @used smart table
			 * @description partial view of reviewArributes
			 */
		$scope.displayedCollection = [].concat($scope.ReviewAttributes);
		
		//Filter on Reviewer data
		$scope.ReviewerFilter = function (result){
			console.log(result.countries.id );
			console.log($rootScope.currentProfile.countryId);
			return (result.countries.id == $rootScope.currentProfile.countryId) ;
		};
		
		/**
		 * @author: selim
		 * @ngdoc method
		 * @name update
		 * @description update reviewer table
		 */
      $scope.$on('$localeChangeSuccess', getReviewData);
		
	
	  
	  
	  /**
		 * @author: selim
		 * @ngdoc method
			 * @name update
			 * @description update reviewer table
			 */
	  $scope.update = function(item) {			
		//Reloads page once Identity Reviewer is updated.	          		        	  
	       		        		  
	        	//$window.location.reload();		        		          		
	         
	       };
	         								
	          
	/*****************Template section**********************/          
	          
	          
	          /**  @author: selim
	  		 * @description counter used for maintaining unique template code
	  		 */
	  	  
	  	  $scope.counter = 1;
	  	  
	  	  /**  @author: selim
	  		 * @ngdoc method
	  		 * @name value
	  		 * @methodOf Button form UI
	  		 * @description called for expanding template row and maintaining country id
	  		 * @param {object}
	  		 *            item country to update
	  		 */
	  	  $scope.value=function(con){
	  		 console.log("Inside value");
	  		  con.expanded = true;		  
	  		  $scope.id=con.countries.id;
	  		  $scope.isoCode=con.countries.isoCode;

	  	  } 
	          
	          /**
	  		 * @author: selim
	  		 * @ngdoc method
	  		 * @name getdata
	  		 * @methodOf
	  		 * @description get all template data
	  		 */
	  	  var getTemplateData = function(){			  
	  		  Templates.query().$promise.then(function(template){			    	 
	  		       $scope.Templates = template;			     			       
	  		      // $scope.addItem = { temp: $scope.Templates };
	  		      // console.log($scope.Templates );
	  		       });
	  		};
	  		  getTemplateData();
		          

		          /**selim
					 * @ngdoc method
					 * @name create
					 * @methodOf
					 * @description Creates template
					 * @param {object}
					 *            item Tempalte to create
					 */
		          $scope.createTemplate = function(item){
		        	console.log("Inside create method");
		        	item.countryCode = localeMapper.getCurrentISOCode();
		        	item.cntry_id={id: JSON.stringify($scope.id)};
		        	console.log($scope.id);
		        	angular.forEach($scope.Templates, function(temp){
			              if (temp.cntry_id.id===$scope.id) {
			            	 // console.log("inside counter")
			            	  $scope.counter++;
			              }
			            });		        	
		        	
		        	var temptype=item.tmpl_type;
		        	console.log("Template Type"+temptype);
		        	if(item.tmpl_type=="InCountry-HCP"){
		        		item.tmpl_code=$scope.isoCode+"LP"+$scope.counter;
		        	} else if(item.tmpl_type=="InCountry-HCO"){
		        		item.tmpl_code=$scope.isoCode+"LO"+$scope.counter;
		        	} else if(item.tmpl_type=="CrossBorder-HCP"){
		        		item.tmpl_code=$scope.isoCode+"GP"+$scope.counter;
		        	} else if(item.tmpl_type=="CrossBorder-HCO"){
		        		item.tmpl_code=$scope.isoCode+"GO"+$scope.counter;
		        	}	
		        	item.tmpl_status="ACTIVE"; 
		        	console.log(item.tmpl_code);
		            $scope.Templates.push(item);
		            
		            Templates.save(item).$promise.then(function(response){
		            	getTemplateData();
		            	toasty.success({
	            	        title: 'Success',
	            	        msg: 'Template added !',
	            	        showClose: true,
	            	        clickToClose: true,
	            	        timeout: 5000,
	            	        sound: false,
	            	        html: false,
	            	        shake: false,
	            	        theme: 'bootstrap'
	            	      });
		            }).catch(function(){		 		    	 
		 		    	 internalError();	
		       		 });
		          };
		          
		          /**selim
					 * @ngdoc method
					 * @name update
					 * @methodOf template update
					 * @description Updates Template
					 * @param {object}
					 *            item Template to update
					 */
		          $scope.updateTemplate = function(item) {
		            angular.forEach($scope.Templates, function(temp){
		              if (temp.id === item.id) {
		                // do nessasary work here if needed
	  
		              }
		            });
		            console.log(item.id);
		            Templates.update({ id:item.id }, item).$promise.then(function(response){
		            	toasty.success({
	            	        title: 'Success',
	            	        msg: 'Template updated !',
	            	        showClose: true,
	            	        clickToClose: true,
	            	        timeout: 5000,
	            	        sound: false,
	            	        html: false,
	            	        shake: false,
	            	        theme: 'bootstrap'
	            	      });
		            	
		            }).catch(function(){
		 		    	 internalError();	
		       		 });
		          };
		          
		          /**selim
					 * @ngdoc method
					 * @name deactivate
					 * @methodOf template update
					 * @description Updates Template
					 * @param {object}
					 *            item Template to update
		 */
		          $scope.deactivateTemplate = function(item) {
		            angular.forEach($scope.Templates, function(temp){
		              if (temp.id === item.id) {
		                // do nessasary work here if needed
		            	  item.tmpl_status="INACTIVE";
		              }
		            });
		            console.log(item.id);
		            
		            Templates.update({ id:item.id }, item).$promise.then(function(response){
		            	
		            	toasty.success({
	            	        title: 'Success',
	            	        msg: 'Template deactivated !',
	            	        showClose: true,
	            	        clickToClose: true,
	            	        timeout: 5000,
	            	        sound: false,
	            	        html: false,
	            	        shake: false,
	            	        theme: 'bootstrap'
	            	      });
		            	
		            }).catch(function(){
		 		    	 internalError();	
		       		 });
		          };
		          /**selim
					 * @ngdoc method
					 * @name delete
					 * @methodOf delete template
					 * @description Deletes Template
					 * @param {object}
					 *            item Template to delete
					 */
		          $scope.deleteTemplate = function(item) {
		            var index = 0;
		            angular.forEach($scope.Templates, function(temp){
		              if (temp.id === item.id){
		                $scope.Templates.splice(index, 1);
		              }
		              index++;
		       });
		            Templates.delete({ id:item.id }).$promise.then(function(response){
		            	toasty.success({
	            	        title: 'Success',
	            	        msg: 'Template deleted !',
	            	        showClose: true,
	            	        clickToClose: true,
	            	        timeout: 5000,
	            	        sound: false,
	            	        html: false,
	            	        shake: false,
	            	        theme: 'bootstrap'
	            	      });
		            	
		            }).catch(function(){
		 		    	 internalError();	
		       		 });
		  };
		  
		  
/*************************Role SECTION**************************************/		  
		  
		  
		  
		// private variables
		    var allUsers = [];

		    // scope variables
		    $scope.addItem = { users: [], roles: []};
		          /**
		  		 * @ngdoc method
		  		 * @name removeExisting
		  		 * @methodOf gcms.administration.controller:AdminRoleCtrl
		  		 * @description Deteremines whether or not to remove existing user.
		  		 * @param {object} The exising user
		  		 */
		  		var removeExisting = function(value){
		  		  for(var i in $scope.profiles){
		  			if($scope.profiles[i].userName === value.userName){
		  			  return false;
		  			}
		  		  }
		  		  return true;
		  		};   
		  		
		  	  
		  var getData = function(){
		      return Role.query().$promise.then(function(roles) {
		        $scope.roles = roles;
		        return UserProfile.query().$promise;
		      }).then(function(profiles){
		        $scope.profiles = profiles;
		        //get all users in the system
		        return UserDetail.query().$promise;
		      }).then(function(users){
		        //copy only the ones not already listed on the page
		        allUsers = users;
		        $scope.users = users.filter(removeExisting);
		        $scope.addItem = { users: $scope.users, roles: $scope.roles};
		        return $rootScope.session.user.getCurrentProfile();
		      }).then(function(profile){
		        var countryId = profile.countryId;
		        return $rootScope.session.user.getAttributes(countryId);
		      }).then(function(attributes){
		        $scope.countryAttributes = attributes;
		      });
		    };

		    getData();
		    
			/**
			 * @ngdoc method
			 * @name create
			 * @methodOf gcms.administration.controller:AdminRoleCtrl
			 * @description Creates new profile based on current country.
			 * @param {object} item The profile to create
			 */
			$scope.create = function(item){
			  $rootScope.session.user.getCurrentProfile().then(function(currentProfile){
				var user = item.user;
				var profile = {};
				user.userProfiles = user.userProfiles || [];

				profile.defaultProfileIndicator = true;
				for (var i in user.userProfiles){
				  if (user.userProfiles[i].defaultProfileIndicator === true){
					profile.defaultProfileIndicator = false;
				  }
				}

				profile.roleId = item.role.id;
				profile.userName = user.userName;
				profile.countryId = currentProfile.countryId;
				profile.createdBy = currentProfile.userName;
				profile.deleteRecord = false;
				profile.deleted = false;

				//UserProfile.save(profile).$promise.then(getData);
				// Added to display success message once the new role added.
				UserProfile.save(profile).$promise.then(function(result){
					getData();
					$scope.success='User role saved successfully';
					}).catch(function(){
						  $scope.error='User not saved';
					  });
			  });
			};

			/**
			 * @ngdoc method
			 * @name delete
			 * @methodOf gcms.administration.controller:AdminRoleCtrl
			 * @description Deletes profile
			 * @param {object} item The profile to delete
			 */
			$scope.delete = function(item) {
			  var userName = item.userName;
			  var user = allUsers.find(function(user){
				return user.userName === userName;
			  });

			  if(!user){ console.log('user not found, delete aborted'); return; }

			  var filterProfiles = function(profile){
				return profile.id !== item.id;
			  };

			  user.userProfiles = user.userProfiles.filter(filterProfiles);
			  $scope.profiles = $scope.profiles.filter(filterProfiles);

			  UserProfile.delete({id: item.id}).$promise.then(getData);
			};

			/**
			 * @ngdoc method
			 * @name delete
			 * @methodOf gcms.administration.controller:AdminRoleCtrl
			 * @description Handles the ok button on the detail modal
			 */
			$scope.detailOk = function(){};			
			
			/**
				 * @ngdoc method
				 * @name delete
				 * @methodOf gcms.administration.controller:AdminRoleCtrl
				 * @description Redirects user to appropriate detail screen
				 */
				$scope.go = function(profile) {
					console.log("Inside go===>>>");
					console.log("Inside go:profile.userName===>>>"+profile.userName);
					
				  $state.go('admin-details', {id: profile.userName});
				};
	
	 
	  
  }
})();
