(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ValidatedProfile', ValidatedProfile);

  ValidatedProfile.$inject = ['$resource','localeMapper', 'ENVIRONMENT'];
  /**
   * @ngdoc method
   * @name business.profile
   * @methodOf gcms.components.data.service:business.profile
   * @description Constructor for the business profile data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The business profile data service
   */
  function ValidatedProfile($resource,localeMapper, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/identityProfiles/:id' + ENVIRONMENT.SERVICE_EXT,
     {
        id: '@id',
        locale: function(){ return localeMapper.getCurrentISOCode();}
      },
      {
        get:    { method:'GET', isArray:true },
        query:  { method:'GET',isArray:true }
      }
    );
  }
})();
