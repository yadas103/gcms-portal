(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Templates', Templates);

  Templates.$inject = ['$resource','$locale','localeMapper', 'ENVIRONMENT'];
  /**
   * VENKAD09
   * @ngdoc method
   * @name Template
   * @methodOf gcms.components.data.service:Template
   * @description Constructor for the Template data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * 
   */
  function Templates($resource,$locale,localeMapper, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/consent-template/:id' + ENVIRONMENT.SERVICE_EXT,
      {
      	  id: '@id',
          locale: function(){ return localeMapper.getCurrentISOCode(); },
        },
      {
    	  update: { method:'PUT' },
          query:  { method:'GET', isArray:true }
      }
    );
  }
})();
