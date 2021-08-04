/**
 * Service to get Credentials
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Credential', Credential);

  Credential.$inject = ['$resource','localeMapper','ENVIRONMENT'];

  function Credential($resource,localeMapper,ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/credential/:id/:partyType' + ENVIRONMENT.SERVICE_EXT,
      {
    	  id: '@id',
    	  partyType: '@partyType',
          locale: function(){ return localeMapper.getCurrentISOCode(); }   	     	  
      },
      {
          query:  { method:'GET', isArray:true }
      }
    );

  }

})();
