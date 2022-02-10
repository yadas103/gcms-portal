/**
 * Service to get Languages
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Language', Language);

  Language.$inject = ['$resource', 'localeMapper', 'ENVIRONMENT'];
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
  function Language($resource,localeMapper,ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':id/language' + ENVIRONMENT.SERVICE_EXT,
      {
    	  id: '@id',
          locale: function(){ return localeMapper.getCurrentISOCode(); }   	     	  
      },
      {
          query:  { method:'GET', isArray:true }
      }
    );

  }

})();
