/**
 * Service to Create missing profiles
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('IdentityRequest', IdentityRequest);

  IdentityRequest.$inject = ['$resource', 'ENVIRONMENT'];

  function IdentityRequest($resource,ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'identity-request/:savedetails' + ENVIRONMENT.SERVICE_EXT,
      {
    	  savedetails: '@savedetails'   	     	  
      },
      {        
        save:   { method:'POST', isArray: false }
      }
    );

  }

})();
