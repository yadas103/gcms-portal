/**
 * Service to get Languages
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('LocalText', LocalText);

  LocalText.$inject = ['$resource', 'localeMapper', 'ENVIRONMENT'];
  /**
   * @ngdoc method
   * @name Language
   * @methodOf gcms.components.data.service:Language
   * @description Constructor for the language data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The language data service
   */
  function LocalText($resource,localeMapper,ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':id/local-text/:language' + ENVIRONMENT.SERVICE_EXT,
      {
    	  id: '@id',
    	  language: '@language',
          locale: function(){ return localeMapper.getCurrentISOCode(); }   	     	  
      },
      {
          query:  { method:'GET', isArray:true }
      }
    );

  }

})();
