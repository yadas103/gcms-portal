/**
 * @ngdoc directive
 * @name gcms.components.uniqueid.directive:gcmsDefaultUniqueid
 * @restrict E
 *
 * @description
 * This directive will determine the appropriate uniqueid type name and value to display on the recipient results screen.
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.uniqueid')
    .directive('gcmsDefaultUniqueid', Uniqueid);

    Uniqueid.$inject = ['uniqueid'];

    /**
     * @ngdoc method
     * @name Uniqueid
     * @methodOf gcms.components.uniqueid.directive:gcmsDefaultUniqueid
     * @description Constructor for the gcmsDefaultUniqueid directive
     * @param {object} uniqueid The uniqueid service
     * @returns {object} gcmsDefaultUniqueid directive
     */
    function Uniqueid(uniqueid) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          recipient: '='
        },
        templateUrl: 'app/components/uniqueid/components.uniqueid.html',
        controller: function($rootScope, $scope, $q) {
          /**
            * @ngdoc method
            * @name getData
            * @methodOf gcms.components.uniqueid.directive:gcmsDefaultUniqueid
            * @description Gets unique id type name and value
            */
          var getData = function(){
            return uniqueid.getDefaultUniqueId($scope.recipient)
            .then(function(uId){
              return $q.all([uId, $rootScope.session.collections.uniqueid()]);
            })
            .then(function(result){
              var selectedUniqueId = result[1].find(function(item){ return item.id === result[0].uniqueIdTypeID; });
              $scope.name = selectedUniqueId ? selectedUniqueId.name : 'N/A';
              $scope.value = result[0].value;
            });
          };

          getData();

          $scope.$on('$localeChangeSuccess', getData);
          
          /**
           * @ngdoc method
           * @methodOf gcms.components.uniqueid.directive:gcmsDefaultUniqueid
           * @description Updates Unique identifier name and value on change of list.
           */
           $scope.$watch('recipient.uniqueIdentifiers', function(){
        	   getData();
           });
        }
      };
    }

})();
