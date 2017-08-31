/**
 * @ngdoc service
 * @name gcms.components.idname.service:idname
 *
 * @description
 * Represents an idname service.
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.idname')
    .factory('idname', idname);

  idname.$inject = [];

  /**
   * @ngdoc method
   * @name idname
   * @methodOf gcms.components.idname.service:idname
   * @description Constructor for the idname service
   * @returns {object} The idname service
   */
  function idname() {

    /**
     * @ngdoc method
     * @name getIdFromName
     * @methodOf gcms.components.idname.service:idname
     * @description Gets id property from the name property in an object.
     * @param {string} name The object name property
     * @param {Array} items The items collection
     * @returns {number} The object id property
     */
    function getIdFromName(name, items) {
      if (!name || !items) { return; }

      var item = items.find(function(element){
        return element.name.toUpperCase() === name.toUpperCase();
      });
      return item ? item.id : 0;
    }

    /**
     * @ngdoc method
     * @name getIdFromValue
     * @methodOf gcms.components.idname.service:idname
     * @description Gets id property from the name property in an object.
     * @param {string} value The object value property
     * @param {Array} items The items collection
     * @returns {number} The object id property
     */
    function getIdFromValue(value, items) {
      if (!value || !items) { return; }

      var item = items.find(function(element){
        return element.value.toUpperCase() === value.toUpperCase();
      });
      return item ? item.id : 0;
    }

    /**
     * @ngdoc method
     * @name getNameFromId
     * @methodOf gcms.components.idname.service:idname
     * @description Gets name property from the id property in an object.
     * @param {number} id The object id property
     * @param {Array} items The items collection
     * @returns {string} The object name property
     */
    function getNameFromId(id, items) {
      if (!id || !items) { return; }

      var item = items.find(function(element){
        return element.id === id;
      });
      return item ? item.name : '';
    }

    return {
      getIdFromName: getIdFromName,
      getIdFromValue: getIdFromValue,
      getNameFromId: getNameFromId
    };

  }

})();
