/**
 * @ngdoc directive
 * @name gcms.components.popover.directive:gcmsPopover
 *
 * @restrict E
 *
 * @description
 * Represents a gcmsPopover directive.
 *
 * ```html
 * <span class="btn btn-default" role="button" gcms-popover><i class="fa fa-filter"></i></span>
 * <div ng-hide="true" class="pop-content">
 *   <gcms-recipient-search></gcms-recipient-search>
 </div>
 * ```
 */
 (function () {

  'use strict';

  angular
    .module('gcms.components.popover')
    .directive('gcmsPopover', Popover);

  Popover.$inject = [];

  /**
   * @ngdoc method
   * @name Popover
   * @methodOf gcms.components.popover.directive:gcmsPopover
   * @description Constructor for the popover directive
   * @returns {object} Popover directive
   **/
  function Popover() {
    return {
        restrict: 'A',
        scope: {
          shown: '=',
        },
        link: function(scope, element) {
            // define popover for this element.
            // then, grab popover content from the next element.

            $(element).popover({
               html: true,
               placement: 'bottom',
               content: $(element).siblings('.pop-content').contents()
            });

        }
    };
  }

})();
