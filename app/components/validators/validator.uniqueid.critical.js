/**
 * @ngdoc directive
 * @name gcms.components.validator.directive:gcmsUniqueIdCritical
 * @restrict A
 *
 * @description
 * Represents a UniqueIdCritical validator directive.
 * This directive will control validation of UniqueIdCritical controls
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.validator')
    .directive('gcmsUniqueIdCritical', UniqueIdCritical);

    UniqueIdCritical.$inject = ['UniqueIdVerification','$q'];

    /**
     * @ngdoc method
     * @name UniqueIdCritical
     * @methodOf gcms.components.validator.directive:gcmsUniqueIdCritical
     * @description Constructor for the UniqueIdCritical directive
     * @returns {object} UniqueIdCritical directive
     */
    function UniqueIdCritical(UniqueIdVerification, $q) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, $element, attributes, ngModel){
          ngModel.$asyncValidators.critical = function(value){
            var defer = $q.defer();
            if(!value || !value.uniqueIdTypeID || !value.value){
              //defer.reject('not enough data');
              defer.resolve();
            } else {
              UniqueIdVerification
              .get({typeId:value.uniqueIdTypeID,uniqueIDValue:value.value}).$promise
              .then(function(result){
                if(result.id && result.businessPartyID !== parseInt(attributes.gcmsUniqueIdAllowed)){ defer.reject(); }
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
