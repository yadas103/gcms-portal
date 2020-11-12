/**
 * @ngdoc service
 * @name gcms.components.data.service:UserProfile
 *
 * @description
 * Represents an user profile data service.
 *
 *```js
 * function myCtrl($scope, UserProfile){
 *   $scope.userProfiles = [];
 *   UserProfile.query().$promise.then(function(result){
 *     $scope.userProfiles = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('UserProfile', UserProfile);

  UserProfile.$inject = ['$rootScope', '$resource', '$log', '$locale', 'localeMapper', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name UserProfile
   * @methodOf gcms.components.data.service:UserProfile
   * @description Constructor for the user profile data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The user profile data service
   */
  function UserProfile($rootScope, $resource, $log, $locale, localeMapper, ENVIRONMENT) {

    var hydrateUserProfiles = function(response) {
      var collections = $rootScope.session.collections;
      var profiles = response.data;

      return collections.country().then(function(countries){
        hydrateCountries(profiles, countries);
        return collections.role();
      }).then(function(roles){
        hydrateRoles(profiles, roles);
        return profiles;
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
      ENVIRONMENT.SERVICE_URI + ':locale/user-profile/:id' + ENVIRONMENT.SERVICE_EXT,
      {
        id: '@id',
        locale: function(){ return localeMapper.getCurrentISOCode(); }
      },
      {
        get:    { method:'GET', interceptor : { response: hydrateUserProfiles }, isArray:false },
        query:  { method:'GET', interceptor: {response: hydrateUserProfiles }, isArray:true },
        update: { method:'PUT' }
      }
    );
  }
})();
