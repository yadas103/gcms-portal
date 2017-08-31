(function () {
  'use strict';

  angular
    .module('gcms')
    .run(['$rootScope','session','permission','$state', function($rootScope, session, permission, $state) {
      $rootScope.session = session.set();
      //preload certain lovs
      $rootScope.session.collections.country();
      $rootScope.session.collections.role();

      var verifyStateAccess = function (ev, to) {
        // console.log('$stateChangeStart:ev',ev);
         //console.log('$stateChangeStart:to',to);
        if(!to.data || !to.data.section || !to.data.action) { return; }
        var permissionDisplayAction = function(show){ 
           //console.log('show', show);
          if(!show){
            ev.preventDefault();
            $state.go('no-permission');
          }
        };

        var verifyPermission = function(){
          return permission.get(to.data.section, to.data.action).then(permissionDisplayAction);
        };
        // while(!resolved){}
        to.resolve = angular.extend( to.resolve || {}, {
          __authenticating__: verifyPermission
        });

      };

      $rootScope.$on('$localeChangeSuccess', function() {
        $state.reload();
      });
      $rootScope.$on('$stateChangeStart', verifyStateAccess);



    }])
  .run(['Idle',function(Idle){
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
  }])
  .filter('offset', function() {
  		return function(input, start) {
    		start = parseInt(start, 10);
    		return input.slice(start);
  		};
	}).filter('unique', [function () {
    return function (items, filterOn) {
      if (filterOn === false) {
        return items;
      }
      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var newItems = [];
        angular.forEach(items, function (item) {
          if(!newItems[item[filterOn]]){
            newItems[item[filterOn]] = item;
          }
        });
        items = [];
        for(var i in newItems){
          items.push(newItems[i]);
        }
      }
      return items;
    };
  }]);
})();
