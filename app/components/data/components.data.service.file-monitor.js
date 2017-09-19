/**
 * @ngdoc service
 * @name gcms.components.data.service:FileMonitor
 *
 * @description
 * Represents a file-monitor data service.
 *
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('FileMonitor', FileMonitor);

  FileMonitor.$inject = ['$resource', '$locale', 'localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name FileMonitor
   * @methodOf gcms.components.data.service:FileMonitor
   * @description Constructor for the file-monitor data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The file-monitor data service
   */
  function FileMonitor($resource, $locale, localeMapper, ENVIRONMENT) {
    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/bulk-upload' + ENVIRONMENT.SERVICE_EXT,
      {
        
        locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {
       
        query: { method:'GET', isArray:true }
      }
    );
  }

})();
