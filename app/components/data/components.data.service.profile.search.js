/**
 * @ngdoc service
 * @name gcms.components.data.service.recipient:RecipientBulkUnlock
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
   * @name RecipientBulkUnlock
   * @methodOf gcms.components.data.service.recipient:RecipientBulkUnlock
   * @description This data service sends an array of recipient ids to be unlocked by the service layer
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} localeMapper A service used to get an ISO code from a locale
      or a locale from an ISO code
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The bulk unlock data service
   */
  function ProfileSearch($resource, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'profile-results/:country/:profileType/:profileCountry/:lastName/:city/:firstName/:address',
      {
    	  country: '@country',
    	  profileType: '@profileType',
    	  lastName: '@lastName',
    	  city: '@city',
    	  firstName: '@firstName',
    	  address: '@address'
        },
        {
            get:    { method:'GET', isArray:true },
            query:  { method:'GET', isArray:true },
            update: { method:'PUT' }
          }
    );

  }

})();
