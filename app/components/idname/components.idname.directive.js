/**
 * @ngdoc directive
 * @name gcms.components.idname.directive:gcmsIdname
 * @restrict E
 *
 * @description
 * Represents a idname directive.
 * This directive will display the name for an object based on it's id.
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.idname')
    .directive('gcmsIdname', Idname);

    Idname.$inject = ['idname'];

    /**
     * @ngdoc method
     * @name Idname
     * @methodOf gcms.components.idname.directive:gcmsIdname
     * @description Constructor for the idname directive
     * @returns {object} gcmsIdname directive
     */
    function Idname(idname) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          id: '=',
          list: '@'
        },
        templateUrl: 'app/components/idname/components.idname.html',
        controller: function($rootScope, $scope) {
          var list = $rootScope.session.collections[$scope.list];
          if(typeof list !== 'function'){
            return;
          }

          var getData = function(){
            if(typeof $scope.id === 'string') { $scope.id = parseInt($scope.id); }
            if($scope.id && $scope.id > 0){
              list().then(function(items){
                $scope.name = idname.getNameFromId($scope.id, items);
              });
            }
          };

          getData();

          $scope.$watch('id', getData);

          $scope.$on('$localeChangeSuccess', getData);
        }
      };
    }

})();
