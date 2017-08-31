/**
 * @ngdoc directive
 * @name gcms.components.state.directive:gcmsMode
 * @restrict E
 *
 * @description
 * Represents a mode directive.
 * This directive will control the mode of controls (view, add, edit)
 *
 * ```html
 * <div gcms-state allowed-states="Add,Edit">
 * </div>
 *```
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.state')
    .directive('gcmsMode', Mode);

    Mode.$inject = ['$animate', '$stateParams'];

    /**
     * @ngdoc method
     * @name Mode
     * @methodOf gcms.components.state.directive:gcmsMode
     * @description Constructor for the Mode directive
     * @returns {object} Mode directive
     */
    function Mode($animate, $stateParams) {
      return {
        restrict: 'A',
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        scope: {
          allowedModes: '@'
        },
        link: function(scope, $element, attributes, controller, $transclude){
          var block, childScope, previousElements;
          /**
           * @ngdoc method
           * @name modeDisplayAction
           * @methodOf gcms.components.state.directive:gcmsMode
           * @description
           * Determines mode
           */
          var modeDisplayAction = function(show){
            if (show) {
              if (!childScope) {
                $transclude(function(clone, newScope) {
                  childScope = newScope;
                  clone[clone.length++] = document.createComment(' end gcmsMode: ');
                  // Note: We only need the first/last node of the cloned nodes.
                  // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                  // by a directive with templateUrl when its template arrives.
                  block = {
                    clone: clone
                  };
                  $animate.enter(clone, $element.parent(), $element);
                });
              }
            } else {
              if (previousElements) {
                previousElements.remove();
                previousElements = null;
              }
              if (childScope) {
                childScope.$destroy();
                childScope = null;
              }
              if (block) {
                previousElements = block.clone;
                $animate.leave(block.clone).then(function() {
                  previousElements = null;
                });
                block = null;
              }
            }
          };

          modeDisplayAction(false);
          var alloweds = scope.allowedModes.split(',');
          for (var i in alloweds){
            if($stateParams['is'+alloweds[i]]){
              modeDisplayAction(true);
              break;
            }
          }

          scope.$on('$localeChangeSuccess', function() {

          });

        }
      };
    }

})();
