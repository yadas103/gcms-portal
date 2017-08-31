(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .controller('GenerateConsentAnnexCtrl', GenerateConsentAnnex);

  GenerateConsentAnnex.$inject = ['GenerateConsentAnnex','$scope','NgTableParams','$stateParams'];

    function GenerateConsentAnnex(GenerateConsentAnnex,$scope,NgTableParams,$stateParams) {
    	var self = this;
        var params = JSON.parse($stateParams.selectedIds);
        // set selectedIds
        if($stateParams.selectedIds !== '[object Object]'){
          $scope.selectedIds = JSON.parse($stateParams.selectedIds);
        }
        $scope.generateConsentAnnex = {};

        var getData = function(){           
            $scope.generateConsentAnnexCopy = null;
            if($stateParams.generateConsentAnnex) {
          	$scope.generateConsentAnnex = $stateParams.generateConsentAnnex;
            $scope.generateConsentAnnexCopy = angular.copy($stateParams.generateConsentAnnex);
              return;
            }

            GenerateConsentAnnex.get(params).$promise
            .then(function(generateConsentAnnex) {
              $scope.generateConsentAnnex = generateConsentAnnex;             
              $scope.generateConsentAnnexCopy = angular.copy(generateConsentAnnex);
            }).catch(function(){
              $state.go('no-permission');
            });
          };
       	
        console.log(params);
          var updateProfile = function(result){
            $scope.generateConsentAnnex = result;
          };

          var loadProfile = function(){
            $scope.generateConsentAnnex = [];
            GenerateConsentAnnex.query(params).$promise.then(updateProfile);
          };

          loadProfile();

          $scope.$on('$localeChangeSuccess', loadProfile);

        
          $scope.update = function(item) {
            $scope.generateConsentAnnex = item;
            GenerateConsentAnnex.update({ id: item.id }, item);
            self.tableParams = new NgTableParams({}, { dataset: generateConsentAnnex});
            
          };
          
              }
})();
