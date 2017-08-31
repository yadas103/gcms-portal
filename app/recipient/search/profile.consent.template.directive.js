(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsTemplates', Templates);

  Templates.$inject = ['Templates','$state','$stateParams'];

    function Templates(Templates,$state,$stateParams) {
      return {
        restrict: 'E',
        scope: {
          request: '@',
	      criteria: '=',
	      result: '&',
	      source: '=',
          'update': '&'
        },
        templateUrl: 'app/recipient/search/consent.template.html',
        controller: function($scope) {
    	
        	 $scope.request = {};
        	 
          var updateTemplates = function(result){
            $scope.templates = result;
          };

          var loadTemplates = function(){
            $scope.templates = [];
            Templates.query().$promise.then(updateTemplates);
          };

          loadTemplates();

          $scope.$on('$localeChangeSuccess', loadTemplates);

        
          $scope.update = function(item) {
            $scope.templates = item;
            Templates.update({ id: item.id }, item);     
          };
          
          // populate $scope request property
          if ($scope.criteria !== undefined){
            $scope.request = $scope.criteria;
          }
          console.log('$scope.criteria'+$scope.criteria);
          $scope.source = $scope.source || 'consent.template.html';

          /**
           * @ngdoc method
           * @name submit
           * @methodOf trs.recipient.directive:trsRecipientSearch
           * @description Builds criteria and submits recipient search form
           */
          $scope.submit = function(request) {
            var criteria = {};

            for(var i in request){
              if (
                typeof request[i] === 'string' ||
                typeof request[i] === 'boolean' ||
                (typeof request[i] === 'number' && request[i] !== 0)
              ){
                criteria[i] = request[i];
                console.log(request[i]);
              }
            }
            $stateParams.criteria = JSON.stringify(criteria);
            $state.go('profile-results', {criteria: JSON.stringify(criteria) } );
            console.log('criteria' + criteria);
          };
        }
      };
    }
    
})();
