/**
 * @ngdoc directive
 * @name gcms.components.state.directive:gcmsCritical
 * @restrict A
 *
 * @description
 * Represents a critical validator directive.
 * This directive will control validation of critical controls
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.validator')
    .directive('gcmsOptional', Optional);

    Optional.$inject = [];

    /**
     * @ngdoc method
     * @name Critical
     * @methodOf gcms.components.state.directive:gcmsCritical
     * @description Constructor for the Critical directive
     * @returns {object} Critical directive
     */
    function Optional() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, $element, attributes, ngModel){
          ngModel.$validators.optional = function(value){
          // console.log('critical',ngModel.$name, value, typeof value);

            switch(typeof value){
              case 'undefined':
                return false;
              case 'object':
                return validateObject(value);
              case 'boolean':
                return true;
              case 'number':
                return !isNaN(value);
              case 'string':
                return value !== '';
              case 'function':
                return true;
              default:
                return false;
            }

            function validateObject(value){
              // console.log('avlidate critical object', Object.prototype.toString.call(value), value.length, attributes);
              switch(Object.prototype.toString.call(value)){
                case '[object Array]':
                  return value.length > 0;
                case '[object Date]':
                  var min = new Date(attributes.min.replace('-', '/')) || new Date(1900,1,1);
                  var max = new Date(attributes.max.replace('-','/')) || new Date(3000,1,1);
                  return value.toISOString && min <= value && value <= max;
                case '[object Object]':
                  return Object.keys(value).length;
                default:
                  return false;
              }
            //   return value !== null && (value.length > 0 || value.toISOString);

            }
          };
        }
      };
    }

})();
