/**
 * @ngdoc service
 * @name gcms.components.permission.service:locale
 *
 * @description
 * Represents a locale service.
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.locale')
    .factory('localeMapper', locale);

  locale.$inject = ['$rootScope', '$locale', 'CONFIG'];

  /**
   * @ngdoc method
   * @name locale
   * @methodOf gcms.components.permission.service:locale
   * @description Constructor for locale service
   * @param {object} $rootScope An execution context providing separation between the model and the view
   * @returns {object} The locale service
   */
  function locale($rootScope, $locale, CONFIG) {

    /**
     * @ngdoc method
     * @name getISOCode
     * @methodOf gcms.components.permission.service:locale
     * @description
     * Maps a given locale to the ISO code of a country.
     * @param {string} locale The locale of a country
     * @returns {string} The ISO code of a country
     */
    function getISOCode(locale) {
      return CONFIG.locale.reduce(function(result, value) {
        if (value.locale === locale){ return value.isoCode; }
        return result;
      }, false);
    }

    /**
     * @ngdoc method
     * @name getLocale
     * @methodOf gcms.components.permission.service:locale
     * @description
     * Maps a given ISO code to the locale of a country.
     * @param {string} isoCode The ISO code of a country
     * @returns {string} The lcoale of a country
     */
    function getLocale(isoCode) {
      return CONFIG.locale.reduce(function(result, value) {
        if (value.isoCode === isoCode){ return value.locale; }
        return result;
      }, false);
    }

    function getCurrentISOCode(){
      return getISOCode($locale.id);
    }

    return {
      getISOCode: getISOCode,
      getLocale: getLocale,
      getCurrentISOCode: getCurrentISOCode
    };

  }

})();
