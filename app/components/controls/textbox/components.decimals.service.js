/**
* @ngdoc service
* @name gcms.components.decimals.service:decimal
*
* @description
* Represents a decimal service.
* This service is responsible for checking the decimal points.
*/
(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsDecimals', Decimals);

    Decimals.$inject = ['state','length'];

    /**
     * @ngdoc method
     * @name Decimals
     * @methodOf gcms.components.decimals.service:decimal
     * @description Constructor for the Decimals service
     * @param {object} state critical/optional/required/view/hide
     * @param {object} length for each attribute
     * @returns {object} Decimals directive
     */
    function Decimals(state, length) {
              return {
            restrict: "A", // Only usable as an attribute of another HTML element
            require: "?ngModel",
            link: function (scope, element, attr, ngModel) {
            	var decimalCount = 2;
                var decimalPoint = ".";
                //While rendering will be invoked
                if(scope.type && scope.type !== 'text' && scope.type !== 'email'){
	            	if(typeof scope.$parent.value ==='undefined'){
		            	 ngModel.$render = function() {
	            		 if (ngModel.$modelValue != null && ngModel.$modelValue >= 0) {
	                        if (typeof decimalCount === "number") {
	                            element.val(ngModel.$modelValue.toFixed(decimalCount).toString().replace(".", ","));
	                        } else {
	                            element.val(ngModel.$modelValue.toString().replace(".", ","));
	                        }
	                     }
		              };
	            }
                //After entering the value, this will be invoked
                ngModel.$parsers.unshift(function(newValue) {
                	if (typeof decimalCount === "number") {
                        var floatValue = parseFloat(newValue.replace(",", "."));
                        if (decimalCount === 0) {
                            return parseInt(floatValue);
                        }
                        return parseFloat(floatValue.toFixed(decimalCount));
                    }
                    return parseFloat(newValue.replace(",", "."));
                });


              //After coming out of the box, this will be invoked
                element.on("change", function(e) {
                	var floatValue = parseFloat(element.val().replace(",", "."));
                	if (!isNaN(floatValue) && typeof decimalCount === "number") {
                        if (decimalCount === 0) {
                            element.val(parseInt(floatValue));
                        } else {
                            var strValue = floatValue.toFixed(decimalCount);
                            element.val(strValue.replace(".", decimalPoint));
                        }
                    }
                });
              }
            }
        };
    }

})();
