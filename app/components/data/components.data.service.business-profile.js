(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Profile', Profile);

  Profile.$inject = ['$resource', 'ENVIRONMENT'];
  
  function Profile($resource, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + 'profile/:id' + ENVIRONMENT.SERVICE_EXT,
     {
        id: '@id'
      },
      {
        //get:    { method:'GET', interceptor : { response: hydrateCountries } },
        query:  { method:'GET',isArray:true }
      }
    );
  }
})();
