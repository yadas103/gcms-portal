/**
 * @ngdoc directive
 * @name gcms.components.permission.directive:gcmsSecure
 * @element ANY
 * @restrict A
 *
 * @description
 * Represents a gcmsSecure directive.
 * Shows or hides html tags based on user permissions.
 *
 * ```html
 * <div gcms-secure section-name="Landing" action-name="create">
 * </div>
 *```
 */
(function () {

  'use strict';

  angular
    .module('gcms.components.permission')
    .directive('gcmsSecure', Permission);

    Permission.$inject = ['$animate', 'permission'];

    /**
     * @ngdoc method
     * @name Permission
     * @methodOf gcms.components.permission.directive:gcmsSecure
     * @description Constructor for the gcmsSecure directive
     * @param {object} $animate The angular service which provides rudimentary
        DOM manipulation functions to insert, remove and move elements within
        the DOM, as well as adding and removing classes
     * @param {object} permission The service which allows us to control the
        visibility of CRUD functionality buttons based on user access level
     * @returns {object} Permission directive
     */
    function Permission($animate, permission) {
      return {
        restrict: 'A',
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        scope: {
          sectionName: '@',
          actionName: '@'
        },
        link: function(scope, $element, attributes, controller, $transclude){
          var block, childScope, previousElements;

          /**
           * @ngdoc method
           * @name permissionDisplayAction
           * @methodOf gcms.components.permission.directive:gcmsSecure
           * @description
           * Determines permissions based on section and action and changes the display accordingly.
           */
          var permissionDisplayAction = function(show){
            if (show) {
              if (!childScope) {
                $transclude(function(clone, newScope) {
                  childScope = newScope;
                  clone[clone.length++] = document.createComment(' end gcmsSecure: ');
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

          permissionDisplayAction(false);

          permission.get(scope.sectionName, scope.actionName).then(permissionDisplayAction);

          scope.$on('$localeChangeSuccess', function() {
            permission.get(scope.sectionName, scope.actionName).then(permissionDisplayAction);
          });

        }
      };
    }

})();
