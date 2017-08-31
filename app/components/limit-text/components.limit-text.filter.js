/**
 * @ngdoc filter
 * @name gcms.components.limittext.filter:limittext
 *
 * @description
 * This filter limits text to a specified number of characters and displays '...' at the end of the text.
 */

(function() {
  'use strict';

  angular
  .module('gcms.components.limittext')
  .filter('limitText', function($sce){

    /**
     * @ngdoc method
     * @name text
     * @methodOf gcms.components.limittext.filter:limittext
     * @description Constructor for the text filter
     * @returns {object} The text filter
     */
    return function limitText(value, wordwise, max, tail) {
      if (!value) { return ''; }

      max = parseInt(max, 10);
      if (max){
        if (value.length > max){
          value = value.substr(0, max);
          if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              value = value.substr(0, lastspace);
            }
          }
          value += '<span style="font-weight:bold; color:#5bc0de">' + (tail || '...') + '</span>';
        }
      }
      return $sce.trustAsHtml(value);
    };
  });
})();
