(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Profile1', Profile1);

  Profile1.$inject = ['$resource','localeMapper', 'ENVIRONMENT'];
  
  function Profile1($resource,localeMapper, ENVIRONMENT) {

	return $resource(
      ENVIRONMENT.SERVICE_URI + ':locale/identityProfiles/:id' + ENVIRONMENT.SERVICE_EXT,
     {
        id: '@id',
        locale: function(){ return localeMapper.getCurrentISOCode();}
      },
      {
        get:    { method:'GET', isArray:false },
        query:  { method:'GET',isArray:true }
      }
    );
  }
})();
