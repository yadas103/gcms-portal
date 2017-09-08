(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsIdentity', IdentityRequest);

  IdentityRequest.$inject = ['IdentityRequest','$state','$stateParams'];

    function IdentityRequest(IdentityRequest,$state,$stateParams) {
      return {
        restrict: 'E',
        scope: {
          request: '@',
	      criteria: '='
        },
        templateUrl: 'app/recipient/createMissingProfiles/create.missing.profile.html',
        controller: function($scope) {
    	               	 
        	 $scope.add = function (new1Value) {
        	        var obj = {};
        	        obj.Name = new1Value;
        	        obj.Value = new1Value;
        	        $scope.Groupss.push(obj);
        	        $scope.group1.name = obj;
        	        $scope.new1Value = '';
        	    } 

        	    $scope.Groupss = [{
        	        Name: 'HCP',
        	        Value: 'HCP'
        	    },   {
        	        Name: 'HCO',
        	        Value: 'HCO'
        	    }];
        	    $scope.group1 = {
        	        name: ""
        	    }
        
        	    
        	    $scope.submit = function(item){
        	    	var request = item;
        	    	
				
        	    	IdentityRequest.save(request);
									
				};

/*        	 
          var updateCountry = function(result){
            $scope.counties = result;
          };

          var loadCountry = function(){
            $scope.counties = [];
            GcmsCountry.query().$promise.then(updateCountry);
          };

          loadCountry();

          $scope.$on('$localeChangeSuccess', loadCountry);

        
          $scope.update = function(item) {
            $scope.counties = item;
            GcmsCountry.update({ id: item.id }, item);     
          };
          
          // populate $scope request property
          if ($scope.criteria !== undefined){
            $scope.request = $scope.criteria;
          }
          console.log('$scope.criteria'+$scope.criteria);
          $scope.source = $scope.source || 'consent.template.html';

          *//**
           * @ngdoc method
           * @name submit
           * @methodOf trs.recipient.directive:trsRecipientSearch
           * @description Builds criteria and submits recipient search form
           *//**/
  
        }
      };
    }
    
})();
