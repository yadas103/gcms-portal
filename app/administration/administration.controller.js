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

  AdminController.$inject = ['$rootScope','$scope','localeMapper','Review','Templates'];

  
  function AdminController($rootScope, $scope,localeMapper,Review,Templates){
	  
	  console.log("Inside controller");
	  
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
			$scope.update = function(item) {			
				 console.log("Inside update function");				  
		         angular.forEach($scope.ReviewAttributes, function(con){
		            console.log(con);	
		         if (con.id === item.id) {
		           con.countries.id=item.countries.id;
		           console.log(con.id);
		           con.updatedDate = new Date();      
		              }
		            }); 		         
		         Review.update({ id:item.id }, item);
		          };
		          
		          /**
					 * @author: selim
					 * @ngdoc method
					 * @name update
					 * @description update reviewer table
					 */
		          $scope.$on('$localeChangeSuccess', getReviewData);

		          /**
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
		        	item.tmpl_code=$scope.isoCode+"-"+$scope.counter;
		        	item.tmpl_status="Pending"; 
		            $scope.Templates.push(item);
		            
		            Templates.save(item).$promise.then(getTemplateData);
		          };
		          
		          /**
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
		            Templates.update({ id:item.id }, item);
		          };
		          
		          /**
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
		            Templates.delete({ id:item.id });
		          };
	 
	  
  }
})();
