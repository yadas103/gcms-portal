 (function () {

   'use strict';

   angular
     .module('gcms.administration')
     .directive('gcmsAdminBox', AdministrationBox);

     AdministrationBox.$inject = [];

     /**
      * @ngdoc method
      * @name AdministrationBox
      * @methodOf gcms.administration.directive:gcmsAdministrationBox
      * @description Constructor for the gcmsAdministrationBox directive
      * @returns {object} gcmsAdministrationBox directive
      */
     function AdministrationBox() {
       return {
         restrict: 'E',
         scope: {
           user: '=',
           doSave: '&save'
         },
         templateUrl: 'app/administration/administration.box.html',
         controller: function($scope) {
           /**
            * @ngdoc method
            * @name save
            * @methodOf gcms.administration.directive:gcmsAdministrationBox
            * @description Saves the user profile with a change reason
            * @param {object} item The change reason
            */
            $scope.save = function(item){
              $scope.doSave()(item);
            };

         }
       };
     }
})();
