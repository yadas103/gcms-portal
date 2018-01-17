

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ConsentPdf', ConsentPdf);

  ConsentPdf.$inject = ['$resource','ENVIRONMENT'];

 
  function ConsentPdf($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'consent-pdf' + ENVIRONMENT.SERVICE_EXT,
      { 
        query:  { method:'GET', isArray:true,responseType: 'arraybuffer'}      
      }
    );

  }

})();
