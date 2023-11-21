
(function () {

  'use strict';

  angular
    .module('gcms.components.session')
    .directive('gcmsSession', Session);

  Session.$inject = ['$log', '$rootScope', '$state', '$interval', 'Review', 'LocalText'];

  /**
   * @ngdoc method
   * @name Session
   * @methodOf gcms.components.session.directive:gcmsSession
   * @description Constructor for the session directive
   * @returns {object} Session directive
   */
  function Session($log, $rootScope, $state, $interval, Review, LocalText) {
    return {
      restrict: 'E',
      scope: {

      },
      templateUrl: 'app/components/session/components.session.html',
      controller: function ($scope) {
        var user = $rootScope.session.user;
        $scope.limit = 15;
        $scope.columns = 0;
        $scope.columnsArray = [];
        $scope.fullName = false;
        $scope.colWidth = '300px';
        $scope.currentId;

        

        $rootScope.loggedInUserRoleId = {};
        var setColumns = function () {
          $scope.columns = Math.ceil($scope.profiles.length / $scope.limit);
          $scope.columnsArray = [];
          for (var i = 0; i < $scope.columns; i++) { $scope.columnsArray.push(i); }

          $scope.colWidth = 300 * ($scope.columns).toString() + 'px';
        };

        $scope.profiles = [];
        user.fullName.then(function (name) {
          $scope.fullName = name;

        }).then(function () {
          return user.getCurrentUser;
        }).then(function (user) {
          $scope.profiles = user.userProfiles;
          setColumns();
        }).catch(function (error) {
          $log.error('error', error);
          $state.go('no-permission');
        });

        $scope.$on('IdleStart', function () {
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
          console.log(currentProfile)
          $scope.currentProfile = currentProfile;
          $rootScope.loggedInUserRole=$scope.currentProfile;
          $rootScope.loggedInUserRoleId=$scope.currentProfile.roleId;
          $scope.getReviewersData(currentProfile);
          if(localStorage.getItem("currentProfile") != null && localStorage.getItem("currentProfile") != undefined){
            $scope.setProfile(currentProfile);
          }
          else{
            user.setProfile(currentProfile);
          }
        });

        /**
         * @ngdoc method
         * @name setProfile
         * @methodOf gcms.components.session.directive:gcmsSession
         * @description
         * Dynamically changes the profile based on user selection
         * @param {object} profile The profile to change the user to
         */
        $scope.setProfile = function (profile) {
          //meenakshi
        $rootScope.profileReviewTabShow = false;
        $rootScope.manageTabShow = false;
        $rootScope.adminTabShow = false;
        $rootScope.homeTabHide = false;
        $rootScope.notificationTabShow = false;
        $rootScope.preAdminTabShow = false;
          $scope.currentProfile = profile;
          localStorage.setItem("currentProfile",JSON.stringify($scope.currentProfile));
          console.log("from set profile",$scope.currentProfile.roleId);
          if ($scope.currentProfile.roleId == 5) {
             $state.go('landing').then(function () {
              localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
              $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
              $rootScope.profileReviewTabShow = true;
              $rootScope.homeTabHide = true;
             
              $rootScope.manageTabShow = true;
              $rootScope.adminTabShow = true;

              for (var i in $rootScope.reviewers) {
                if ($rootScope.reviewers[i].cntryReviewer != null) {
                  if (angular.lowercase($scope.ReviewAttributes[i].cntryReviewer).includes(angular.lowercase($scope.currentProfile.userName))) {
                    $rootScope.profileReviewTabShow = true;
                  }
                }
              }
              $rootScope.$apply();
              user.setProfile(profile);
            });
          }
          if ($scope.currentProfile.roleId == 6) {
            $state.go('notification').then(function () {
              localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
              $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
              $rootScope.profileReviewTabShow = false;
              $rootScope.manageTabShow = false;
              $rootScope.adminTabShow = false;
              $rootScope.homeTabHide = false;
              $rootScope.notificationTabShow = true;
              $rootScope.preAdminTabShow = true;
             
              user.setProfile(profile);
            });
          }
          if ($scope.currentProfile.roleId == 7) {
            $state.go('notification').then(function () {
              localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
              $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
              $rootScope.profileReviewTabShow = false;
              $rootScope.manageTabShow = false;
              $rootScope.homeTabHide = false;
              $rootScope.notificationTabShow = true;
              $rootScope.preAdminTabShow = false;
              $rootScope.adminTabShow = false;
            
              user.setProfile(profile);
            });
          }
          
          ////
          if ($scope.currentProfile.roleId == 1) {
              $state.go('landing').then(function () {
                localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
                $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
                $rootScope.profileReviewTabShow = false;
                $rootScope.manageTabShow = true;
                $rootScope.homeTabHide = true;
                $rootScope.notificationTabShow = false;
                $rootScope.preAdminTabShow = false;
                $rootScope.adminTabShow = false;
              
                user.setProfile(profile);
              });
            }
          
          if ($scope.currentProfile.roleId == 2) {
              $state.go('landing').then(function () {
                localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
                $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
                $rootScope.profileReviewTabShow = false;
                $rootScope.manageTabShow = true;
                $rootScope.homeTabHide = true;
                $rootScope.notificationTabShow = false;
                $rootScope.preAdminTabShow = false;
                $rootScope.adminTabShow = false;
              
                user.setProfile(profile);
              });
            }
          if ($scope.currentProfile.roleId == 3) {
              $state.go('landing').then(function () {
                localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
                $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
                $rootScope.profileReviewTabShow = false;
                $rootScope.manageTabShow = true;
                $rootScope.homeTabHide = true;
                $rootScope.notificationTabShow = false;
                $rootScope.preAdminTabShow = false;
                $rootScope.adminTabShow = false;
              
                user.setProfile(profile);
              });
            }
          if ($scope.currentProfile.roleId == 4) {
              $state.go('landing').then(function () {
                localStorage.setItem("countryCode", $scope.currentProfile.countryISOCode)
                $rootScope.loggedInUserRoleId = $scope.currentProfile.roleId;
                $rootScope.profileReviewTabShow = false;
                $rootScope.manageTabShow = true;
                $rootScope.homeTabHide = true;
                $rootScope.notificationTabShow = false;
                $rootScope.preAdminTabShow = false;
                $rootScope.adminTabShow = false;
              
                user.setProfile(profile);
              });
            }
          
          
          
        };



        $scope.setLanguage = function (language) {
          console.log('Here in setLanguage***SD1....' + language);
          $rootScope.currentProfile.currentLanguage = language;
          getLocalText($rootScope.currentProfile.countryId, $rootScope.currentProfile.currentLanguage.languageCode);
          return language;
        };

        var getLocalText = function (countryId, languageCode) {
          LocalText.query({ id: countryId, language: languageCode }).$promise.then(loadLocalText);
        };

        var loadLocalText = function (localData) {
          $rootScope.translationData = localData;
        };

        $scope.getReviewersData = function (currentProfile) {
          Review.query().$promise.then(function (review) {
            $scope.ReviewAttributes = review;
            $rootScope.reviewers = review;
            if (currentProfile.roleId == 5) {
              $rootScope.profileReviewTabShow = true;
            }

            for (var i in $scope.ReviewAttributes) {
              if ($scope.ReviewAttributes[i].cntryReviewer != null) {
                if (angular.lowercase($scope.ReviewAttributes[i].cntryReviewer).includes(angular.lowercase(currentProfile.userName)) && currentProfile.roleId == 5) {
                  $rootScope.profileReviewTabShow = true;
                }

              }
            }

          });
        };

        $interval(user.getCurrentProfile(), 1000 * 60 * 10); //call get profile every 10 minutes to keep the session alive

      }
    };
  }

})();