(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('ValidatedProfile', ValidatedProfile);

  ValidatedProfile.$inject = ['$resource','localeMapper', 'ENVIRONMENT'];
  
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
