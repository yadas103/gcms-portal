/**
 * Service to Create missing profiles
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('IdentityRequest', IdentityRequest);

  IdentityRequest.$inject = ['$resource','localeMapper','ENVIRONMENT'];

  function IdentityRequest($resource,localeMapper,ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/identity-request/:savedetails' + ENVIRONMENT.SERVICE_EXT,
      {
    	  savedetails: '@savedetails',
          locale: function(){ return localeMapper.getCurrentISOCode(); }   	     	  
      },
      {        
        save:   { method:'POST', isArray: false }
      }
    );

  }

})();
