/**
 *
 * Js file implemented for generating Consent Annex Template for 
 * Pending task on clicking the view link in Consent History pop-up
 * 
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ConsentAnnexView', ConsentAnnexView);

  ConsentAnnexView.$inject = ['$resource','$locale','localeMapper', 'ENVIRONMENT'];
  /**
   * @ngdoc method
   * @name ConsentAnnexView
   * @methodOf gcms.components.data.service:ConsentAnnexView
   * @description Constructor for the ConsentAnnexView data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * 
   */
  function ConsentAnnexView($resource,$locale,localeMapper, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/consent-annex-view/:id' + ENVIRONMENT.SERVICE_EXT,
      {
      	  id: '@id',
          locale: function(){ return localeMapper.getCurrentISOCode(); },
        },
      {
    	  update: { method:'PUT' }
      }
    );
  }
})();
