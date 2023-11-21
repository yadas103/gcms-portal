(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName===>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
(function () {
  'use strict';

  angular
    .module('gcms.administration')
    .controller('UserRoleCtrl', UserRole);

  UserRole.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UserDetail'];

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
  function UserRole($rootScope, $scope, $stateParams, $state, UserDetail){
	  console.log("Inside UserRole===>>>");
    var userName = $stateParams.id;
    console.log("Inside UserRole:userName==>>>"+userName);
    var defaultProfile = {};
    var session = $rootScope.session;
    $scope.allowDefaultCountryChange = false;
    $scope.currentProfile = {};

    /**
     * @ngdoc method
     * @name getData
     * @methodOf gcms.administration.controller:UserRoleCtrl
     * @description Gets data
     */
    var getData = function(){
    	console.log("Inside getData===>>>");
      return session.collections.role().then(function(roles) {
    	  console.log("Inside getData 1===>>>");
        $scope.roles = roles;
        return UserDetail.get({userName: userName}).$promise;
      }).then(function(user){
    	  console.log("Inside getData 2===>>>");
        $scope.user = user;
        defaultProfile = user.userProfiles.find(function(item){ return item.defaultProfileIndicator === true; });
        return session.user.getCurrentProfile();
      }).then(function(currentProfile){
    	  console.log("Inside getData 3===>>>");
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
