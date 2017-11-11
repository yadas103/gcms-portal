(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Task', Task);

  Task.$inject = ['$resource','$locale','localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name Task
   * @methodOf gcms.components.data.service:ConsentAnnex
   * @description Constructor for the ConsentAnnex data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} $locale A service which provides localization rules
      for various Angular components
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * 
   */
  function Task($resource,$locale,localeMapper, ENVIRONMENT) {

    return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/task-details/:id' + ENVIRONMENT.SERVICE_EXT,
      {
    	id: '@id',
        locale: function(){ return localeMapper.getCurrentISOCode(); },
      },
      { 
    	  get: {
    		  method:'GET',
    		  params:{	
    			  		payercountry:'@payercountry',    			  		
    			  		lastName:'@lastName',
    			  		firstName:'@firstName',
    			  		profilecountry:'@profilecountry',
    			  		eventName:'@eventName',
    			  		consentStaus:'@consentStaus',
    			  		taskStatus:'@taskStatus',
    			  		initiatedBy:'@initiatedBy',
    			  		page:'@page',
    			  		size:'@size',
    			  		sort:'@sort',
    			  		reverse:'@reverse'
    				  },
    		  isArray:false
    		  },  
    	update: { method:'PUT' },
        query:  { method:'GET', isArray:false }
      }
    );

  }

})();
