

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ConsentAnnexPdf', ConsentAnnexPdf);

  ConsentAnnexPdf.$inject = ['$resource','ENVIRONMENT'];

 
  function ConsentAnnexPdf($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'consent-annex-pdf' + ENVIRONMENT.SERVICE_EXT,
      { 
        query:  { method:'GET', isArray:true,responseType: 'arraybuffer'}      
      }
    );

  }

})();
