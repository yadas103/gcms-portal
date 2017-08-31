/**
 * @ngdoc directive
 * @name gcms.components.state.directive:gcmsUniqueIdRequired
 * @restrict A
 *
 * @description
 * Represents a UniqueIdRequired validator directive.
 * This directive will control validation of UniqueIdRequired controls
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.validator')
    .directive('gcmsUniqueIdRequired', UniqueIdRequired);

    UniqueIdRequired.$inject = ['UniqueIdVerification','$q'];

    /**
     * @ngdoc method
     * @name UniqueIdRequired
     * @methodOf gcms.components.state.directive:gcmsUniqueIdRequired
     * @description Constructor for the UniqueIdRequired directive
     * @returns {object} UniqueIdRequired directive
     */
    function UniqueIdRequired(UniqueIdVerification, $q) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, $element, attributes, ngModel){
          ngModel.$asyncValidators.required = function(value){
            var defer = $q.defer();
            if(!value || !value.uniqueIdTypeID || !value.value){
              //defer.reject('not enough data');
              defer.resolve();
            } else {
              UniqueIdVerification
              .get({typeId:value.uniqueIdTypeID,uniqueIDValue:value.value}).$promise
              .then(function(result){
                if(result.id && result.businessPartyID !== attributes.gcmsUniqueIdAllowed){ defer.reject(); }
                else { defer.resolve(); }
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
