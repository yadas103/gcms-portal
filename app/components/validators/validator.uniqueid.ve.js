/**
 * @ngdoc directive
 * @name gcms.components.validator.directive:gcmsUniqueIdVe
 * @restrict A
 *
 * @description
 * Represents a UniqueIdVe validator directive.
 * This directive will control validation of UniqueIdVe controls
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.validator')
    .directive('gcmsUniqueIdVe', UniqueIdVe);

    UniqueIdVe.$inject = ['$rootScope', '$q', 'UniqueIdVerification'];

    /**
     * @ngdoc method
     * @name UniqueIdVe
     * @methodOf gcms.components.validator.directive:gcmsUniqueIdVe
     * @description Constructor for the UniqueIdVe directive
     * @returns {object} UniqueIdVe directive
     */
    function UniqueIdVe($rootScope, $q, UniqueIdVerification) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, $element, attributes, ngModel){
          ngModel.$asyncValidators.critical = function(value){
            var uniqueIdTypeId = null;
            var uniqueIdValue = null;
            var defer = $q.defer();

            if(!value){
              defer.resolve();
            } else {
              // set variables
              if (attributes.uniqueidvalue){
                uniqueIdTypeId = value;
                uniqueIdValue = attributes.uniqueidvalue;
              } else {
                if (attributes.uniqueidtypeid){
                  uniqueIdTypeId = attributes.uniqueidtypeid;
                  uniqueIdValue = value;
                }
              }

              // set initial validity
              if (scope.form.uniqueIdValue){
                scope.form.uniqueIdValue.$setValidity('uniqueIdValue', true);
              }

              // check validity
              UniqueIdVerification
              .get({typeId: uniqueIdTypeId, uniqueIDValue: uniqueIdValue}).$promise
              .then(function(result){
                if (!attributes.recipientId){
                  // add mode
                  if(result.id){
                    if (scope.form.uniqueIdValue){
                      scope.form.uniqueIdValue.$setValidity('uniqueIdValue', false);
                    }
                    defer.reject();
                  } else {
                    defer.resolve();
                  }

                } else {
                  // edit mode
                  if(result.id && result.businessPartyID !== parseInt(attributes.recipientid)){
                    if (scope.form.uniqueIdValue){
                      scope.form.uniqueIdValue.$setValidity('uniqueIdValue', false);
                    }
                    defer.reject();
                  } else {
                    defer.resolve();
                  }
                }

              })
              .catch(function(){
                defer.resolve();
              });
            }

            return defer.promise;
          };
        }
      };
    }

})();
