/**
 * @ngdoc directive
 * @name gcms.components.session.directive:gcmsSession
 * @restrict E
 *
 * @description
 * Represents a session directive.
 * This directive will display the user name and allow to switch countries and roles.
 *
 * ```html
 <ul class="nav navbar-nav navbar-right" style="padding-right:15px" ng-if="fullName">
   <li class="dropdown">
     <a class="dropdown-toggle toggle-nav-exPadding pull-right" data-toggle="dropdown">
       <h6 ng-repeat="(id,profile) in profiles | filter: { countryId : currentProfile.countryId }">
         <i class="famfamfam-flag-{{profile.countryISOCode.toLowerCase()}}"></i>
         Welcome, {{ fullName }}
         <i class="fa fa-user fa user-space"></i>
         <i class="fa fa-sort-desc"></i>
       </h6>
     </a>
     <ul class="dropdown-menu" role="menu">
       <li>
           <div class="row" style="width: {{300*columns}}px;  margin-left: 0px;">
               <ul class="list-unstyled col-md-{{12/columns}}" ng-repeat="column in columnsArray">
                   <li ng-repeat="(id,profile) in profiles | offset:limit*column | limitTo : limit">
                     <a ng-click="setProfile(profile)" >
                       <i class="famfamfam-flag-{{profile.countryISOCode.toLowerCase()}}"></i>
                       {{profile.countryName}} ({{profile.roleName}})
                       <i class="fa fa-check-circle fa-fw" ng-if="profile.countryId == currentProfile.countryId"></i>
                     </a>
                   </li>
               </ul>
           </div>
       </li>
       <li gcms-secure section-name="Administration" action-name="Read" class="divider" style="margin:1px 0px 0px 0px; padding:0"></li>
       <li gcms-secure section-name="Administration" action-name="Read"><a ui-sref="admin-roles"><i class="fa fa-cog fa-fw"></i> Administration</a></li>
     </ul>
   </li>
 </ul>
 *```
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.session')
    .directive('gcmsSession', Session);

    Session.$inject = ['$log', '$rootScope','$state','$interval','Review'];

    /**
     * @ngdoc method
     * @name Session
     * @methodOf gcms.components.session.directive:gcmsSession
     * @description Constructor for the session directive
     * @returns {object} Session directive
     */
    function Session($log, $rootScope, $state, $interval,Review) {
      return {
        restrict: 'E',
        scope: {

        },
        templateUrl: 'app/components/session/components.session.html',
        controller: function($scope) {
          var user = $rootScope.session.user;
          $scope.limit = 15;
          $scope.columns = 0;
          $scope.columnsArray = [];
          $scope.fullName = false;
          $scope.colWidth = '300px';
          $rootScope.profileReviewTabShow = false;
          $rootScope.loggedInUserRoleId={};
          
          var setColumns = function(){
            $scope.columns = Math.ceil($scope.profiles.length/$scope.limit);
            $scope.columnsArray = [];
            for (var i = 0; i < $scope.columns; i++) { $scope.columnsArray.push(i); }

            $scope.colWidth = 300*($scope.columns).toString() + 'px';
          };

          $scope.profiles = [];
          user.fullName.then(function(name){
            $scope.fullName = name;
            
          }).then(function(){
            return user.getCurrentUser;
          }).then(function(user){
            $scope.profiles = user.userProfiles;
            setColumns();
          }).catch(function(error){
            $log.error('error',error);
            $state.go('no-permission');
          });

          $scope.$on('IdleStart', function() {
              // the user appears to have gone idle
              //console.log('the user appears to have gone idle');
              $state.go('timeout');
          });

          /**
           * @ngdoc method
           * @name getCurrentRole
           * @methodOf gcms.components.session.directive:gcmsSession
           * @description
           * Retrieves the current role of a user
           * @returns {object} current role of a user
           */
          user.getCurrentProfile().then(function(currentProfile){
            $scope.currentProfile = currentProfile; 
            $rootScope.loggedInUserRoleId=$scope.currentProfile.roleId;
            
            $scope.getReviewersData(currentProfile);
            user.setProfile(currentProfile);
          });

          /**
           * @ngdoc method
           * @name setProfile
           * @methodOf gcms.components.session.directive:gcmsSession
           * @description
           * Dynamically changes the profile based on user selection
           * @param {object} profile The profile to change the user to
           */
          $scope.setProfile = function(profile) {
            $state.go('landing').then(function(){
              $scope.currentProfile = profile;
              $rootScope.loggedInUserRoleId=$scope.currentProfile.roleId;
             
              user.setProfile(profile);
            });
          };

          $scope.getReviewersData = function(currentProfile){		  								
      		   Review.query().$promise.then(function(review){		    	 					
      		       $scope.ReviewAttributes = review;								
      		    for(var i in $scope.ReviewAttributes){								
      		    	if($scope.ReviewAttributes[i].cntryReviewer != null){							
      	   				if ($scope.ReviewAttributes[i].countries.name == currentProfile.countryName && $scope.ReviewAttributes[i].cntryReviewer.includes(currentProfile.userName)){						
      	   					$rootScope.profileReviewTabShow = true;	
      	   					}				
      	   				}							
   			}							    		       								
      		       });	    		   
      		  };								

          
          $interval(user.getCurrentProfile(),1000*60*10); //call get profile every 10 minutes to keep the session alive

        }
      };
    }

})();
