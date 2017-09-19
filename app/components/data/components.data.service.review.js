

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Review', Review);

  Review.$inject = ['$resource','$locale','localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name Role
   * @methodOf gcms.components.data.service:Role
   * @description Constructor for the role data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The role data service
   */
  function Review($resource,$locale,localeMapper, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/review/:id' + ENVIRONMENT.SERVICE_EXT,
      {
    	  id: '@id',
    	  locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {
        update: { method:'PUT' },
      	query:  { method:'GET', isArray:true }
      }
    );
  }

})();
