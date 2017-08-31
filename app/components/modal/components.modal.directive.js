/**
 * @ngdoc directive
 * @name gcms.components.modal.directive:gcmsModal
 *
 * @restrict E
 *
 * @description
 * Represents a gcmsModal directive.
 *
 * ```html
 <a ng-click="open()">
   <ng-transclude></ng-transclude>
 </a>
 * ```
 * @param {string} template the name of the template which should be used for the modal
 * @param {string} controller the name of the controller which should be used for the modal
 * @param {string=} content optional content to be used in the modal, if the modal supports it
 * @param {closure=} cancel the callback which is called when the modal is closed with "Cancel"
 * @param {closure=} ok the callback which is called when the modal is closed with "OK"
 */
 (function () {

  'use strict';

  angular
    .module('gcms.components.modal')
    .directive('gcmsModal', Modal);

  Modal.$inject = [];

  /**
   * @ngdoc method
   * @name Modal
   * @methodOf gcms.components.modal.directive:gcmsModal
   * @description Constructor for the modal directive
   * @returns {object} Modal directive
   */
  function Modal() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        template: '@',
        controller: '@',
        content: '=',
        cancel: '&',
        ok: '&'
      },
      templateUrl: 'app/components/modal/components.modal.html',
      controller: function($scope, $modal) {

        $scope.cancel = $scope.cancel || function(){};

        /**
         * @ngdoc method
         * @name resolve
         * @methodOf gcms.components.modal.directive:gcmsModal
         * @description
         * Resolves the promise returned by the modal instance result
         */
        $scope.resolve = function(item) {
          $scope.ok()(item);
        };

        /**
         * @ngdoc method
         * @name reject
         * @methodOf gcms.components.modal.directive:gcmsModal
         * @description
         * Rejects the promise returned by the modal instance result
         */
        $scope.reject = function() {
          $scope.cancel();
        };

        /**
         * @ngdoc method
         * @name open
         * @methodOf gcms.components.modal.directive:gcmsModal
         * @description
         * Opens the modal instance
         */
        $scope.open = function(){

          var modalInstance = $modal.open({
            templateUrl: 'app/components/modal/templates/' + $scope.template,
            controller: $scope.controller,
            resolve: {
               item: function () {
                 return $scope.content;
               }
            }
          });

          modalInstance.result
            .then(  $scope.resolve  )
            .catch( $scope.reject   );

          return modalInstance;
        };
      }
    };
  }
})();
