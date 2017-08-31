/**
 
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Profile', Profile);

  Profile.$inject = ['$resource', 'localeMapper', 'ENVIRONMENT'];

 
  function Profile($resource, localeMapper, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'profile:name' + ENVIRONMENT.SERVICE_EXT,
      {
        name: '@name'
      },
      
      {
        query:  { method:'GET', isArray:true }
      }
    );

  }

})();
