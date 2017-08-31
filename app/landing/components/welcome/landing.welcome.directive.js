/**
 * @ngdoc directive
 * @name gcms.landing.directive:gcmsWelcome
 * @scope
 * @restrict E
 *
 * @description
 * Represents a welcome directive which displays a welcome message to the user.
 * Calling this directive produces the following output
 *
 * ```html
 <div class="welcome-message">
    <img src="assets/img/gcms_logo.png" class="center-block" width="495px" height="365px" alt="Pfizer"/>
    <div>
      <h2>{{welcome.title}}</h2>
      <span gcms-secure section-name="Landing" action-name="update">
       <gcms-modal template="landing.welcome.html" controller="ModalDefaultCtrl"
         content="welcome" ok="update" alt="Edit Welcome">
         <i class='fa fa-pencil'></i>
       </gcms-modal>
     </span>
   </div>
   <p>
     {{welcome.message}}
   </p>
 </div>
 * ```
 *
 * @param {closure=} update the closure which is called when the message is updated
 */
(function () {

  'use strict';

  angular
    .module('gcms.landing')
    .directive('gcmsWelcome', WelcomeMsg);

    WelcomeMsg.$inject = ['Welcome'];

    /**
     * @ngdoc method
     * @name WelcomeMsg
     * @methodOf gcms.landing.directive:gcmsWelcome
     * @description Constructor for the gcmsWelcome directive
     * @param {object} Welcome The welcome data service
     * @returns {object} Welcome directive
     */
    function WelcomeMsg(Welcome) {
        return {
          restrict: 'E',
          scope: {
            'update': '&'
          },
          templateUrl: 'app/landing/components/welcome/landing.welcome.html',
          controller: function($scope) {

            var updateWelcome = function(result){
              $scope.welcome = result;
            };

            var loadWelcome = function(){
              $scope.welcome = [];
              Welcome.query().$promise.then(updateWelcome);
            };

            loadWelcome();

            $scope.$on('$localeChangeSuccess', loadWelcome);

            /**
             * @ngdoc method
             * @name update
             * @methodOf gcms.landing.directive:gcmsWelcome
             * @description Updates welcome message
             * @param {object} item Welcome object
             */
            $scope.update = function(item) {
              $scope.welcome = item;
              Welcome.update({ id: item.id }, item);
            };

          }
        };
      }

  })();
