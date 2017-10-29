/**
 * @ngdoc service
 * @name gcms.components.data.service:business-profile
 *
 * @description
 * Represents an business profile data service.
 *
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Profile', Profile);

  Profile.$inject = ['$resource', 'ENVIRONMENT'];
  /**
   * @ngdoc method
   * @name business-profile
   * @methodOf gcms.components.data.service:business-profile
   * @description Constructor for the business profile data service 
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The business profile data service
   */
  
  function Profile($resource, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + 'profile/:id' + ENVIRONMENT.SERVICE_EXT,
     {
        id: '@id'
      },
      {       
        query:  { method:'GET',isArray:true }
      }
    );
  }
})();
