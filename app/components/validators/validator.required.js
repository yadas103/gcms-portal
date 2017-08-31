/**
 * @ngdoc directive
 * @name gcms.components.state.directive:gcmsRequired
 * @restrict A
 *
 * @description
 * Represents a Required validator directive.
 * This directive will control validation of Required controls
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.validator')
    .directive('gcmsRequired', Required);

    Required.$inject = [];

    /**
     * @ngdoc method
     * @name Required
     * @methodOf gcms.components.state.directive:gcmsRequired
     * @description Constructor for the Required directive
     * @returns {object} Required directive
     */
    function Required() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, $element, attributes, ngModel){
          ngModel.$validators.required = function(value){
          // console.log('Required',ngModel.$name, value, typeof value);

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
              // console.log('object', Object.prototype.toString.call(value), value.length);
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
              return value !== null && (value.length > 0 || value.toISOString);

            }
          };
        }
      };
    }

})();
