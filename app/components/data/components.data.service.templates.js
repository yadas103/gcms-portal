(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Templates', Templates);

  Templates.$inject = ['$resource', 'ENVIRONMENT'];
  
  function Templates($resource, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + 'lov/consent-template/:id' + ENVIRONMENT.SERVICE_EXT,
     {
        id: '@id'
      },
      {
        query:  { method:'GET',isArray:true }
      }
    );
  }
})();
