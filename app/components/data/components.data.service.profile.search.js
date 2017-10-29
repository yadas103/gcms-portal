/**
 * @ngdoc service
 * @name gcms.components.data.service.profile.search:ProfileSearch
 *
 * @description
 * Represents a bulk unlock data service for recipients.
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ProfileSearch', ProfileSearch);

  ProfileSearch.$inject = ['$resource', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name ProfileSearch
   * @methodOf gcms.components.data.service.profile.search:ProfileSearch
   * @description This data service sends parameters country,profileType,profileCountry,lastName,city,firstName,address,id
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} Profiles
   */
  function ProfileSearch($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'profile-results/:country/:profileType/:collectingCountry/:lastName/:city/:firstName/:address/:id',
      {
    	  country: '@country',
    	  profileType: '@profileType',
    	  lastName: '@lastName',
    	  city: '@city',
    	  firstName: '@firstName',
    	  address: '@address',
    	  id: '@id'
        },
        {
            get:    { method:'GET', isArray:true },
            query:  { method:'GET', isArray:true },
            update: { method:'PUT' }
          }
    );

  }

})();
