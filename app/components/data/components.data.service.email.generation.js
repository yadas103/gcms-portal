(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('EmailGeneration', EmailGeneration);

  EmailGeneration.$inject = ['$resource', 'ENVIRONMENT','$locale', 'localeMapper'];

  function EmailGeneration($resource,ENVIRONMENT,$locale, localeMapper) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/send-email/:emaildetails' + ENVIRONMENT.SERVICE_EXT,
      {
    	  emaildetails: '@emaildetails',
    	  locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {        
        save:   { method:'POST', isArray: false }
      }
    );

  }

})();
