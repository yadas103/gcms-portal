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
    .module('dctmNgFileManager')
    .directive('gcmsUpload', Modal);

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
      templateUrl:'app/filemanager/templates/upload.modal.html',
      controller: function($scope, $modal) {
    	  
    	   /*$scope.cancel = $scope.cancel || function(){
    		   
    	   };*/
    	   
    	  /*
    	   * selim
    	   * methode added for cancel model
    	   */
    	  var temp = angular.copy($scope.content);
    	  $scope.edit = $scope.content;
    	  
    	   $scope.cancel = function(){
    		   console.log("Inside cancel function");
    		   angular.copy(temp, $scope.edit);
    		   
    	   };

           /**
            * @ngdoc method
            * @name resolve
            * @methodOf gcms.components.modal.directive:gcmsModal
            * @description
            * Resolves the promise returned by the modal instance result
            */
           $scope.resolve = function(item) {
        	 // $scope.modelBeingEdited = item;
             $scope.ok()(item);
             console.log("in resove" +item)
           };

           /**
            * @ngdoc method
            * @name reject
            * @methodOf gcms.components.modal.directive:gcmsModal
            * @description
            * Rejects the promise returned by the modal instance result
            */
           $scope.reject = function() {
        	   console.log("Inside cancel directive");
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
               templateUrl: 'app/filemanager/templates/' + $scope.template,
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
