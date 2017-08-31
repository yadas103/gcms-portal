/**
 * @ngdoc directive
 * @name gcms.components.uniqueid.directive:gcmsUploadDefaultUniqueid
 * @restrict E
 *
 * @description
 * This directive will determine the appropriate uniqueid type name and value to display on the upload screen.
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.uniqueidupload')
    .directive('gcmsUploadDefaultUniqueid', UniqueidUpload);

    UniqueidUpload.$inject = ['uniqueidupload'];

    /**
     * @ngdoc method
     * @name UniqueidUpload
     * @methodOf gcms.components.uniqueid.directive:gcmsUploadDefaultUniqueid
     * @description Constructor for the gcmsUploadDefaultUniqueid directive
     * @param {object} uniqueidupload The uniqueidupload service
     * @returns {object} gcmsUploadDefaultUniqueid directive
     */
    function UniqueidUpload(uniqueidupload) {
      return {
        restrict: 'E',
        scope: {
          recipient: '='
        },
        templateUrl: 'app/components/uniqueid-upload/components.uniqueid-upload.html',
        controller: function($rootScope, $scope) {
          /**
            * @ngdoc method
            * @name getData
            * @methodOf gcms.components.uniqueid.directive:gcmsUploadDefaultUniqueid
            * @description Gets unique id type name and value
            */
          var getData = function(){
            return uniqueidupload.getUploadDefaultUniqueId($scope.recipient)
            .then(function(uId){
              $scope.name = uId.name;
              $scope.value = uId.value;
            });
          };

          getData();

          $scope.$on('$localeChangeSuccess', getData);
        }
      };
    }

})();
