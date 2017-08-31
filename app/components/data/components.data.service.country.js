/**
 * @ngdoc service
 * @name gcms.components.data.service:Country
 *
 * @description
 * Represents a country data service.
 *
 *```js
 * function myCtrl($scope, Country){
 *   $scope.countries = [];
 *   Country.query().$promise.then(function(result){
 *     $scope.countries = result;
 *   });
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('Country', Country);

  Country.$inject = ['$resource', '$rootScope', '$log', 'ENVIRONMENT'];

  /**
   * @ngdoc method
   * @name Country
   * @methodOf gcms.components.data.service:Country
   * @description Constructor for the country data service
   * @param {object} $resource A factory which creates a resource object
      that lets you interact with RESTful server-side data sources
   * @param {object} ENVIRONMENT The configuration object which supplies a
      consistent service uri to use across the application
   * @returns {object} The country data service
   */
  function Country($resource, $rootScope, $log, ENVIRONMENT) {

    var hydrateCountries = function(response){
      var collections = $rootScope.session.collections;
      var countries = response.data;

      return collections.locale().then(function(locales){
         hydrateLocales(countries, locales);
         return countries;
       }).catch(function(err){
         $log.error(err);
       });
    };

    var hydrateLocales = function(countries, locales)  {
      for (var i in countries){
        var locale = getItemByIsoCode(countries[i].isoCode, locales);
        if (locale){
          countries[i].locale = locale.locale;
        }
      }
    };

    var getItemByIsoCode = function(isoCode, types){
      for (var i in types) {
        if (types[i].isoCode === isoCode) {
          return types[i];
        }
      }
    };

    return $resource(
      ENVIRONMENT.SERVICE_URI + 'country/:id' + ENVIRONMENT.SERVICE_EXT,
      {
        id: '@id'
      },
      {
        //get:    { method:'GET', interceptor : { response: hydrateCountries } },
        query:  { method:'GET', interceptor: { response: hydrateCountries }, isArray:true },
        update: { method:'PUT' }
      }
    );
  }

})();
