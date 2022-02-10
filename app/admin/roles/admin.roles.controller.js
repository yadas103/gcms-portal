/**
 * @ngdoc overview
 * @name gcms.administration.controller:AdminRoleCtrl
 * @description
 * This controller displays all users/roles in a particular country.
 *
 *```html
 <h3>Administration</h3>

 <hr/>

 <div gcms-secure section-name="Administration" action-name="create" style="padding-bottom:20px">
   <gcms-modal template="admin.role.create.html" controller="ModalDefaultCtrl" content="addItem" ok="create" alt="Add Role">
     <span class="btn btn-default" role="button"><i class="fa fa-plus"></i></span>
   </gcms-modal>
 </div>

 <div class="panel panel-primary">
   <div class="panel-heading">Users</div>

   <div class="panel-body">
     <table class="table table-hover roles-table">
       <thead>
         <tr>
           <th gcms-secure section-name="Administration" action-name="update"></th>
           <th gcms-secure section-name="Administration" action-name="delete"></th>
           <th>Username</th>
           <th>Country</th>
           <th ng-repeat="role in roles">
             <gcms-modal template="admin.role.detail.html" controller="ModalDefaultCtrl" content="role" ok="detailOk" alt="Role Details">{{role.roleName}}</gcms-modal>
           </th>
         </tr>
       </thead>
       <tbody>
         <tr class="adminRole" ng-repeat="profile in profiles | orderBy:'userName'">

           <td gcms-secure section-name="Administration" action-name="update"
             class="cursor-pointer" style="padding-right:10px">
               <a ng-click="go(profile)"><i class="fa fa-pencil"></i></a>
           </td>

           <td gcms-secure section-name="Administration" action-name="delete">
             <gcms-modal template="admin.role.delete.html" controller="ModalDefaultCtrl"
               content="profile" ok="delete" alt="delete user">
               <i class="fa fa-trash"></i>
             </gcms-modal>
           </td>

           <td>{{profile.userName}}</td>

           <td>{{profile.countryISOCode}}</td>

           <td ng-repeat="role in roles"><i ng-show="profile.roleId === role.id" class="fa fa-check"></i></td>

         </tr>
       </tbody>
     </table>
   </div>
 </div>

 <div gcms-secure section-name="Administration" action-name="create" style="padding-bottom:20px">
   <gcms-modal template="admin.role.create.html" controller="ModalDefaultCtrl" content="addItem" ok="create" alt="Add Role">
     <span class="btn btn-default" role="button"><i class="fa fa-plus"></i></span>
   </gcms-modal>
 </div>

 <div class="panel panel-primary">
   <div class="panel-heading">Country Attributes</div>

   <div class="panel-body">
     <table class="table table-hover roles-table">
       <thead>
         <tr>
           <th>Name</th>
           <th>Schema</th>
           <th>Table</th>
           <th>Field</th>
           <th>Hidden</th>
           <th>Critical</th>
           <th>Required</th>
           <th>Optional</th>
           <th>View</th>
         </tr>
       </thead>
       <tbody>
         <tr class="adminRole" ng-repeat="field in countryAttributes">
           <td>{{field.attributeName}}</td>
           <td>{{field.schemaName}}</td>
           <td>{{field.tableName}}</td>
           <td>{{field.columnName}}</td>
           <td><i ng-show="field.criticalRequiredOptionalIndicator === 'H'" class="fa fa-check"></td>
           <td><i ng-show="field.criticalRequiredOptionalIndicator === 'C'" class="fa fa-check"></td>
           <td><i ng-show="field.criticalRequiredOptionalIndicator === 'R'" class="fa fa-check"></td>
           <td><i ng-show="field.criticalRequiredOptionalIndicator === 'O'" class="fa fa-check"></td>
           <td><i ng-show="field.criticalRequiredOptionalIndicator === 'V'" class="fa fa-check"></td>
         </tr>
       </tbody>
     </table>
   </div>
 </div>
 *```
 */
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('AdminRoleCtrl', AdminRole);

  AdminRole.$inject = ['$rootScope', '$scope', '$state', 'UserProfile', 'UserDetail', 'Role'];

  /**
   * @ngdoc method
   * @name AdminRole
   * @methodOf gcms.administration.controller:AdminRoleCtrl
   * @description Constructor for the admin role controller
   * @param {object} $rootScope A root object that refers to the application model. It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events.
   * @param {object} $scope A descendent object that refers to the application model.  It is an execution context for expressions. Scopes are arranged in hierarchical structure which mimic the DOM structure of the application. Scopes can watch expressions and propagate events.
   * @param {object} $state The service used to determine the mode of a control (critical, required, optional, view, hidden).
   * @param {object} UserProfile The user profile data service.
   * @param {object} UserDetail The user detail data service.
   * @param {object} Role The role data service.
   */
  function AdminRole($rootScope, $scope, $state, UserProfile, UserDetail, Role){
    // private variables
    var allUsers = [];

    // scope variables
    $scope.addItem = { users: [], roles: []};

    /**
     * @ngdoc method
     * @name removeExisting
     * @methodOf gcms.administration.controller:AdminRoleCtrl
     * @description Deteremines whether or not to remove existing user.
     * @param {object} The exising user
     */
    var removeExisting = function(value){
      for(var i in $scope.profiles){
        if($scope.profiles[i].userName === value.userName){
          return false;
        }
      }
      return true;
    };

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:AdminRoleCtrl
     * @description Gets data
     */
    var getData = function(){
      return Role.query().$promise.then(function(roles) {
        $scope.roles = roles;
        return UserProfile.query().$promise;
      }).then(function(profiles){
        $scope.profiles = profiles;
        //get all users in the system
        return UserDetail.query().$promise;
      }).then(function(users){
        //copy only the ones not already listed on the page
        allUsers = users;
        $scope.users = users.filter(removeExisting);
        $scope.addItem = { users: $scope.users, roles: $scope.roles};
        return $rootScope.session.user.getCurrentProfile();
      }).then(function(profile){
        var countryId = profile.countryId;	//console.log(countryId);
        getAllLanguages(countryId);
        return $rootScope.session.user.getAttributes(countryId);
      }).then(function(attributes){
        $scope.countryAttributes = attributes;
      });
    };

    var getAllLanguages = function(countryId){
    	Language.query({id : countryId}).$promise.then(updateLanguages);
    };
    var updateLanguages = function(result){
    	$rootScope.languages = result;
    	
    	var arr = result.filter(d => d.default === 'Y');
    	$rootScope.defaultLanguage = arr[0].languageName;
	};

    	
    getData();

    /**
     * @ngdoc method
     * @name create
     * @methodOf gcms.administration.controller:AdminRoleCtrl
     * @description Creates new profile based on current country.
     * @param {object} item The profile to create
     */
    $scope.create = function(item){
      $rootScope.session.user.getCurrentProfile().then(function(currentProfile){
        var user = item.user;
        var profile = {};
        user.userProfiles = user.userProfiles || [];

        profile.defaultProfileIndicator = true;
        for (var i in user.userProfiles){
          if (user.userProfiles[i].defaultProfileIndicator === true){
            profile.defaultProfileIndicator = false;
          }
        }

        profile.roleId = item.role.id;
        profile.userName = user.userName;
        profile.countryId = currentProfile.countryId;
        profile.createdBy = currentProfile.userName;
        profile.deleteRecord = false;
        profile.deleted = false;

        UserProfile.save(profile).$promise.then(getData);
      });
    };

    /**
     * @ngdoc method
     * @name delete
     * @methodOf gcms.administration.controller:AdminRoleCtrl
     * @description Deletes profile
     * @param {object} item The profile to delete
     */
    $scope.delete = function(item) {
      var userName = item.userName;
      var user = allUsers.find(function(user){
        return user.userName === userName;
      });

      if(!user){ console.log('user not found, delete aborted'); return; }

      var filterProfiles = function(profile){
        return profile.id !== item.id;
      };

      user.userProfiles = user.userProfiles.filter(filterProfiles);
      $scope.profiles = $scope.profiles.filter(filterProfiles);

      UserProfile.delete({id: item.id}).$promise.then(getData);
    };

    /**
     * @ngdoc method
     * @name delete
     * @methodOf gcms.administration.controller:AdminRoleCtrl
     * @description Handles the ok button on the detail modal
     */
    $scope.detailOk = function(){};

    /**
     * @ngdoc method
     * @name delete
     * @methodOf gcms.administration.controller:AdminRoleCtrl
     * @description Redirects user to appropriate detail screen
     */
    $scope.go = function(profile) {
     $state.go('admin-details', {id: profile.userName});
    };

    /**
     * @ngdoc event
     * @name $localeChangeSuccess
     * @eventOf gcms.administration.controller:AdminRoleCtrl
     * @eventType broadcast on root scope
     */
    $scope.$on('$localeChangeSuccess', getData);

  }
})();
