/**
 * @ngdoc directive
 * @name gcms.components.state.directive:gcmsDetectDuplicates
 * @restrict A
 *
 * @description
 * Represents a DetectDuplicates validator directive.
 * This directive will control validation of DetectDuplicates controls
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.validator')
    .directive('gcmsDetectDuplicates', DetectDuplicates);

    DetectDuplicates.$inject = [];

    /**
     * @ngdoc method
     * @name DetectDuplicates
     * @methodOf gcms.components.state.directive:gcmsDetectDuplicates
     * @description Constructor for the DetectDuplicates directive
     * @returns {object} DetectDuplicates directive
     */
    function DetectDuplicates() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, $element, attributes, ngModel){
          ngModel.$validators.critical = function(value){
            //console.log('DetectDuplicates',ngModel.$name, value, typeof value);
            if(!value) { return true; }

            var checkValue = function(i){
              return !value.some(function(j){
                return i.uniqueIdTypeID && j.uniqueIdTypeID && i !== j && j.uniqueIdTypeID === i.uniqueIdTypeID && j.value === i.value;
              });
            };
            var dupeFound =  value.every(checkValue);
            //console.log('dupe found', !dupeFound);
            return dupeFound;
          };
        }
      };
    }

})();
