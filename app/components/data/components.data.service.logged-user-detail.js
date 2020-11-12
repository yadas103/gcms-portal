/**
 * @ngdoc service
 * @name gcms.components.data.service:LoggedUserDetail
 *
 * @description
 * Represents a logged user detail data service.

 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('LoggedUserDetail', LoggedUserDetail);

  LoggedUserDetail.$inject = ['$rootScope', '$resource', '$log', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name User
   * @methodOf gcms.components.data.service:LoggedUserDetail
   * @description Constructor for the logged user detail data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The logged user detail data service
   */
  function LoggedUserDetail($rootScope, $resource, $log, ENVIRONMENT) {
	console.log('Here in user-detail....');
    var hydrateUserDetails = function(response) {
      var collections = $rootScope.session.collections;
      var userDetails = response.data;
console.log('Here in user-detail***11....');
console.log('Here in user-detail***22....');
      return collections.country().then(function(countries){
         hydrateCountries(userDetails.userProfiles, countries);
         return collections.role();
       }).then(function(roles){
         hydrateRoles(userDetails.userProfiles, roles);
         return userDetails;
       }).catch(function(err){
         $log.error(err);
       });
    };

    var hydrateCountries = function(profiles, countries)  {
      for (var i in profiles){
        var country = getItemById(profiles[i].countryId, countries);
        profiles[i].countryName = country.name;
        profiles[i].countryISOCode = country.isoCode;
        profiles[i].regionId = country.regionId;
      }
    };

    var hydrateRoles = function(profiles, roles)  {
      for (var i in profiles){
        var role = getItemById(profiles[i].roleId, roles);
        profiles[i].roleName = role.roleName;
      }
    };

    var getItemById = function(id, types){
      for (var i in types) {
        if (types[i].id === id) {
          return types[i];
        }
      }
    };

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'logged-user-detail' + ENVIRONMENT.SERVICE_EXT,
      {},
      {
        query:  { method:'GET', interceptor: {response: hydrateUserDetails }, isArray:false },
      }
    );

  }
})();
