/**
 * @ngdoc overview
 * @name gcms.admin
 * @author: yadav03
 * @description Represents a admin controller.
 */
(function () {
  'use strict';


  angular
    .module('gcms.pre-administration')
    .controller('PreAdminCtrl', PreAdminController);

  PreAdminController.$inject = ['$rootScope','$scope','$state','localeMapper','Review','PreTemplates','UserProfile', 'UserDetail', 'Role','$window','toasty'];

  
  function PreAdminController($rootScope, $scope,$state,localeMapper,Review,PreTemplates,UserProfile, UserDetail, Role,$window,toasty){
	  
	  console.log("Inside Pre-Administration");
	  
	  /**
		 * 
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

	  	  };
	          
	          /**
	  		 * @author: selim
	  		 * @ngdoc method
	  		 * @name getdata
	  		 * @methodOf
	  		 * @description get all pretemplate data
	  		 */
	  	 var getPreTemplateData = function(){			  
	  		PreTemplates.query().$promise.then(function(template){			    	 
	  		       $scope.PreTemplates = template;			     			       
	  		     for(var i in $scope.PreTemplates){
	  		    	 if($scope.PreTemplates[i].dates_rages == 'Y'){
	  		    	 if(i != "$promise" || i != "$resolve"){
	 				$scope.PreTemplates[i].validity_start_date = moment($scope.PreTemplates[i].validity_start_date,'YYYY-MM-DD');
	 				$scope.PreTemplates[i].validity_end_date = moment($scope.PreTemplates[i].validity_end_date,'YYYY-MM-DD')  ;
	 				$scope.PreTemplates[i].validity_start_date = moment.tz($scope.PreTemplates[i].validity_start_date,moment.tz.guess());   			
	 				$scope.PreTemplates[i].validity_end_date = moment.tz($scope.PreTemplates[i].validity_end_date,moment.tz.guess());
	 				$scope.PreTemplates[i].validity_start_date = moment($scope.PreTemplates[i].validity_start_date).format('DD-MM-YYYY');
	 				$scope.PreTemplates[i].validity_end_date = moment($scope.PreTemplates[i].validity_end_date).format('DD-MM-YYYY')  ;
	 				$scope.PreTemplates[i].startDate = $scope.PreTemplates[i].validity_start_date;
	 				$scope.PreTemplates[i].endDate = $scope.PreTemplates[i].validity_end_date;
	 				$scope.date($scope.PreTemplates[i]);
	  		    	 }
	  		    	 }
	  		    	 } 
	  		       });
	  		};
	  		getPreTemplateData();
		          

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
		        	angular.forEach($scope.PreTemplates, function(temp){
			              if (temp.cntry_id.id===$scope.id) {
			            	  $scope.counter++;
			              }
			            });		        	
		        	
		        	var temptype=item.tmpl_type;
		        	console.log("Template Type"+temptype);
		        	if(item.tmpl_type=="Intro"){
		        		item.tmpl_code=$scope.isoCode+"LP"+$scope.counter;
		        	} else if(item.tmpl_type=="TOV"){
		        		item.tmpl_code=$scope.isoCode+"LO"+$scope.counter;
		        	}
		        	item.tmpl_status="INACTIVE"; 
		        	delete item.expanded;
		            $scope.PreTemplates.push(item);
		           
		            item.validity_start_date =  moment.tz(item.validity_start_date,moment.tz.guess()) ;				            
		            item.validity_end_date =  moment.tz(item.validity_end_date,moment.tz.guess()) ;
		         	item.validity_start_date = moment(item.validity_start_date).format('YYYY-MM-DD');   			
	            	item.validity_end_date = moment(item.validity_end_date).format('YYYY-MM-DD');

	            	delete item.validity_start;
			        delete item.validity_end;
			        delete item.startDate;
			        delete item.endDate;
		           
		           if(item.validity_start_date  == "Invalid date" || item.validity_start_date  == undefined ){
		        	   delete item.validity_start_date ;
		           }
		           
		           if(item.validity_end_date == "Invalid date" || item.validity_end_date == undefined){
		        	   delete item.validity_end_date;
		           }
		           
		         /*check if duplicate template present*/
		           var flage = false;
		           for(var i=0; i<$scope.PreTemplates.length-1; i++) { 
		        	   if ($scope.PreTemplates[i].tmpl_name === item.tmpl_name) {
		        		   flage = true;
		        	   }
		        	 }
		          
	            if(flage == false){
		          PreTemplates.save(item).$promise.then(function(response){
		        	   getPreTemplateData();
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
	            }else{
	                toasty.error({
                        title: 'Error',
                        msg: 'Template name already exists',
                        showClose: true,
                        clickToClose: true,
                        timeout: 5000,
                        sound: false,
                        html: false,
                        shake: false,
                        theme: 'bootstrap'
                    });
	               $scope.PreTemplates.push(item);
	               getPreTemplateData();
	            }
		          };
		          
		          	$scope.close=function(item){
		          		getPreTemplateData();
		          	};
		          /**selim
					 * @ngdoc method
					 * @name update
					 * @methodOf template update
					 * @description Updates Template
					 * @param {object}
					 *            item Template to update
					 */
		          
		          $scope.date = function(item){		        	  
		        	  item.validity_start_date = moment(item.startDate,'DD-MM-YYYY');
		        	  item.validity_end_date = moment(item.endDate,'DD-MM-YYYY')  ;
		        	  item.validity_start_date = moment.tz(item.validity_start_date,moment.tz.guess());   			
		              item.validity_end_date = moment.tz(item.validity_end_date,moment.tz.guess());		            			        	  
		        	  item.validity_start = moment(item.startDate,'DD-MM-YYYY').format('DD-MM-YYYY');
		        	  item.validity_end = moment(item.endDate,'DD-MM-YYYY').format('DD-MM-YYYY')  ;
		        	};
		  		
		  		
		          
		          $scope.updateTemplate = function(item) {
		            angular.forEach($scope.PreTemplates, function(temp){
		              if (temp.id === item.id) {
		            	  temp.updatedDate = new Date();
		              }
		            });
		            console.log(item.id);
		            
		 	           if(item.validity_start != undefined)
		 	           {
		 	        	  item.validity_start = moment(item.validity_start,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_start = moment(item.validity_start_date,'DD-MM-YYYY');
		 	           }
		 	           if(item.validity_end != undefined)
		 	           {
		 	        	  item.validity_end = moment(item.validity_end,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_end = moment(item.validity_end_date,'DD-MM-YYYY');
		 		       }
		 	           if(item.validity_start != undefined)
		 	           {
		 	        	  item.validity_start = moment(item.validity_start,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_start = moment(item.validity_start_date,'DD-MM-YYYY');
		 	           }
		 	           if(item.validity_end != undefined)
		 	           {
		 	        	  item.validity_end = moment(item.validity_end,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_end = moment(item.validity_end_date,'DD-MM-YYYY');
		 		       }
		       		
		            	item.validity_start_date = moment.tz(item.validity_start,moment.tz.guess());   			
		            	item.validity_end_date = moment.tz(item.validity_end,moment.tz.guess());
		       	   
		            	item.validity_start_date = moment(item.validity_start).format('YYYY-MM-DD');   			
		            	item.validity_end_date = moment(item.validity_end).format('YYYY-MM-DD');

		            	delete item.validity_start;
				        delete item.validity_end;
				        delete item.startDate;
				        delete item.endDate;
			           
			           if(item.validity_start_date  == "Invalid date" || item.validity_start_date  == undefined ){
			        	   delete item.validity_start_date ;
			           }
			           
			           if(item.validity_end_date == "Invalid date" || item.validity_end_date == undefined){
			        	   delete item.validity_end_date;
			           }
		            
		            delete item.expanded;
		            PreTemplates.update({ id:item.id }, item).$promise.then(function(response){
		            	getPreTemplateData();
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
		            angular.forEach($scope.PreTemplates, function(temp){
		              if (temp.id === item.id) {
		            	  temp.updatedDate = new Date();
		            	  item.tmpl_status="INACTIVE";
		              }
		            });
		            console.log(item.id);
		 	           if(item.validity_start != undefined)
		 	           {
		 	        	  item.validity_start = moment(item.validity_start,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_start = moment(item.validity_start_date,'DD-MM-YYYY');
		 	           }
		 	           if(item.validity_end != undefined)
		 	           {
		 	        	  item.validity_end = moment(item.validity_end,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_end = moment(item.validity_end_date,'DD-MM-YYYY');
		 		       }
		 	           if(item.validity_start != undefined)
		 	           {
		 	        	  item.validity_start = moment(item.validity_start,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_start = moment(item.validity_start_date,'DD-MM-YYYY');
		 	           }
		 	           if(item.validity_end != undefined)
		 	           {
		 	        	  item.validity_end = moment(item.validity_end,'DD-MM-YYYY');
		 	           }
		 	           else
		 	           {	        	   
		 	        	  item.validity_end = moment(item.validity_end_date,'DD-MM-YYYY');
		 		       }
		       		
		            	item.validity_start_date = moment.tz(item.validity_start,moment.tz.guess());   			
		            	item.validity_end_date = moment.tz(item.validity_end,moment.tz.guess());
		       	   
		            	item.validity_start_date = moment(item.validity_start).format('YYYY-MM-DD');   			
		            	item.validity_end_date = moment(item.validity_end).format('YYYY-MM-DD');

		            	delete item.validity_start;
				        delete item.validity_end;
				        delete item.startDate;
				        delete item.endDate;
			           
			           if(item.validity_start_date  == "Invalid date" || item.validity_start_date  == undefined ){
			        	   delete item.validity_start_date ;
			           }
			           
			           if(item.validity_end_date == "Invalid date" || item.validity_end_date == undefined){
			        	   delete item.validity_end_date;
			           }
		            
			           PreTemplates.update({ id:item.id }, item).$promise.then(function(response){
			           getPreTemplateData();
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
					 * @name deactivate
					 * @methodOf template update
					 * @description Updates Template
					 * @param {object}
					 *            item Template to update
		 */
		          
		          $scope.activateTemplate = function(item) {
		        	  if(item.tmpl_location!=undefined &&item.tmpl_location !='' ){
			            angular.forEach($scope.PreTemplates, function(temp){
			              if (temp.id === item.id) {
			            	  temp.updatedDate = new Date();
			            	  item.tmpl_status="ACTIVE";
			              }
			            });
			            console.log(item.id);
			 	           if(item.validity_start != undefined)
			 	           {
			 	        	  item.validity_start = moment(item.validity_start,'DD-MM-YYYY');
			 	           }
			 	           else
			 	           {	        	   
			 	        	  item.validity_start = moment(item.validity_start_date,['DD-MM-YYYY','YYYY-MM-DD']).format('DD-MM-YYYY');
			 	           }
			 	           if(item.validity_end != undefined)
			 	           {
			 	        	  item.validity_end = moment(item.validity_end,'DD-MM-YYYY');
			 	           }
			 	           else
			 	           {	        	   
			 	        	  item.validity_end = moment(item.validity_end_date,['DD-MM-YYYY','YYYY-MM-DD']).format('DD-MM-YYYY');
			 		       }
			 	           if(item.validity_start != undefined)
			 	           {
			 	        	  item.validity_start = moment(item.validity_start,'DD-MM-YYYY');
			 	           }
			 	           else
			 	           {	        	   
			 	        	  item.validity_start = moment(item.validity_start_date,'DD-MM-YYYY');
			 	           }
			 	           if(item.validity_end != undefined)
			 	           {
			 	        	  item.validity_end = moment(item.validity_end,'DD-MM-YYYY');
			 	           }
			 	           else
			 	           {	        	   
			 	        	  item.validity_end = moment(item.validity_end_date,'DD-MM-YYYY');
			 		       }
			       		
			            	item.validity_start_date = moment.tz(item.validity_start,moment.tz.guess());   			
			            	item.validity_end_date = moment.tz(item.validity_end,moment.tz.guess());
			       	   
			            	item.validity_start_date = moment(item.validity_start).format('YYYY-MM-DD');   			
			            	item.validity_end_date = moment(item.validity_end).format('YYYY-MM-DD');

			            	delete item.validity_start;
					        delete item.validity_end;
					        delete item.startDate;
					        delete item.endDate;
				           
				           if(item.validity_start_date  == "Invalid date" || item.validity_start_date  == undefined ){
				        	   delete item.validity_start_date ;
				           }
				           
				           if(item.validity_end_date == "Invalid date" || item.validity_end_date == undefined){
				        	   delete item.validity_end_date;
				           }
			            
			            PreTemplates.update({ id:item.id }, item).$promise.then(function(response){
			            	getPreTemplateData();
			            	toasty.success({
		            	        title: 'Success',
		            	        msg: 'Template Activated !',
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
		        	  }else{
		        		  toasty.error({
		        	          title: 'Error',
		        	          msg: 'Please Upload Template !',
		        	          showClose: true,
		        	          clickToClose: true,
		        	          timeout: 5000,
		        	          sound: false,
		        	          html: false,
		        	          shake: false,
		        	          theme: 'bootstrap'
		        	        });
		        	  }
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
		            PreTemplates.delete({ id:item.id }).$promise.then(function(response){
		            	if(response.string == 1)
		            	{
		            	angular.forEach($scope.PreTemplates, function(temp){
		  		              if (temp.id === item.id){
		  		                $scope.PreTemplates.splice(index, 1);
		  		              }
		  		              index++;
		  		       });	
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
		              } else if(response.string == 2){
		            	  getPreTemplateData();
		            	  toasty.error({
		        	          title: 'Error',
		        	          msg: 'There are Incompleted Task associated with this template ! Not able to Delete',
		        	          showClose: true,
		        	          clickToClose: true,
		        	          timeout: 10000,
		        	          sound: false,
		        	          html: false,
		        	          shake: false,
		        	          theme: 'bootstrap'
		        	        });
		              }
		            	
		            }).catch(function(){
		 		    	 internalError();	
		       		 });
		  };
		  
		  
/*************************Role SECTION**************************************/		  
		  
		  
		  
		    var allUsers = [];

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
		  		
		  $scope.profiles =[]; 
		  var getData = function(){
		      return Role.query().$promise.then(function(roles) {
		        $scope.roles = roles;
		        return UserProfile.query().$promise;
		      }).then(function(profiles){
		    	  profiles.forEach(item =>{

	                    if(item.roleName == 'Pre-Notification Admin' || item.roleName == 'Pre-Notification User'){

	                        $scope.profiles.push(item);

	                    }

	                })
		        return UserDetail.query().$promise;
		      }).then(function(users){
		        allUsers = users;
		        $scope.users = users.filter(removeExisting);
		        $scope.addItem = { users: $scope.users, roles: $scope.roles};
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
