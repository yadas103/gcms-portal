/**
 * @ngdoc overview
 * @name gcms.administration.controller:UserRoleCtrl
 * @description
  * This controller displays all countries/roles for a particular user.
 *
 *```html
 <h3>Administration</h3>

 <hr/>

 <div class="row">
   <div class = "col-sm-9">
     <div class="panel panel-primary">
       <div class="panel-heading">
         {{user.userName}}
       </div>

       <div class="panel-body">
         <table class="table table-hover roles-table">
           <thead>
             <tr>
               <th>Primary</th>
               <th>Country</th>
               <th ng-repeat="role in roles">{{role.roleName}}</th>
             </tr>
           </thead>
           <tbody>
             <tr ng-repeat="profile in user.userProfiles" class="userRole">

               <td ng-if="allowDefaultCountryChange">
                 <input name="primary" type="radio" ng-model="profile.defaultProfileIndicator"
                   ng-value="true" ng-change="setPrimary(profile.countryId)" />
               </td>
               <td ng-if="!allowDefaultCountryChange">
                 <i ng-show="profile.defaultProfileIndicator === true" class="fa fa-check"></i>
               </td>

               <td><gcms-idname id="profile.countryId" list="country"></gcms-idname></td>

               <td ng-repeat="role in roles">

                 <span ng-if="profile.countryId === currentProfile.countryId">
                   <input name="profile.roleId" type="radio" ng-model="profile.roleId" value="{{role.id}}" />
                 </span>

                 <span ng-if="profile.countryId !== currentProfile.countryId">
                   <i ng-show="profile.roleId === role.id" class="fa fa-check"></i>
                 </span>

               </td>

             </tr>
           </tbody>
         </table>
       </div>

     </div>

   </div>

   <div class="col-sm-3">
     <gcms-administration-box user="user" save="save"></gcms-administration-box>
   </div>
 </div>
 *```
 */

(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail','$window'];

  /**
   * @ngdoc method
   * @name UserRole
   * @methodOf gcms.administration.controller:UserRoleCtrl
   * @description Constructor for the user role controller
   * @param {object} $rootScope A root object that refers to the application model. It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events.
   * @param {object} $scope A descendent object that refers to the application model.  It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events.
   * @param {object} $stateParams An object that provides controllers or other services with the individual parts of the navigated URL.
   * @param {object} $state The service used to determine the mode of a control (critical, required, optional, view, hidden).
   * @param {object} UserDetail The user detail data service
   */
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail,$window){
    // private variables
    var userName = $stateParams.id;
    var defaultProfile = {};
    var session = $rootScope.session;
    // scope variables
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
      return session.collections.role().then(function(roles) {
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
        $scope.currentProfile = currentProfile;
        $scope.allowDefaultCountryChange = currentProfile.countryId === defaultProfile.countryId;
      });
    };

    getData();

    /**
     * @ngdoc method
     * @name setPrimary
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Sets the primary profile for a user
     * @param {object} countryId The country identifier
     */
    $scope.setPrimary = function(countryId){
      for (var i in $scope.user.userProfiles){
        if ($scope.user.userProfiles[i].countryId !== countryId){
          $scope.user.userProfiles[i].defaultProfileIndicator = false;
        }
      }
    };

    /**
     * @ngdoc method
     * @name save
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Updates the specified user profile
     */
    $scope.save = function(item){
      UserDetail.update({userName: userName}, $scope.user).$promise.then(function(){ $state.go('admin'); });
    	//UserDetail.update({userName: userName}, $scope.user).$promise.then(function(){ $window.location.reload(); });
    };

    /**
     * @ngdoc event
     * @name $localeChangeSuccess
     * @eventOf gcms.administration.controller:UserRoleCtrl
     * @eventType broadcast on root scope
     */
    $scope.$on('$localeChangeSuccess', getData);

  }
})();
