/**
 * @ngdoc service
 * @name gcms.components.address.service:address
 *
 * @description
 * Represents an address service.
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.address')
    .factory('address', address);

  address.$inject = ['$rootScope', 'idname'];

  /**
   * @ngdoc method
   * @name address
   * @methodOf gcms.components.address.service:address
   * @description Constructor for the address service
   * @returns {object} The address service
   */
  function address($rootScope, idname) {

    /**
     * @ngdoc method
     * @name getAddressTypeIds
     * @methodOf gcms.components.address.service:address
     * @description Gets an array of address type ids
     * @returns {object} An array of address type ids
     */
    var getAddressTypeIds = function() {
      return $rootScope.session.collections.addressType()
      .then(function(addressTypes){
        var addressTypeIds = [];
        addressTypeIds.push(idname.getIdFromName('PRIMARY ADDRESS', addressTypes));
        addressTypeIds.push(idname.getIdFromName('ADDITIONAL ADDRESS 1', addressTypes));
        addressTypeIds.push(idname.getIdFromName('ADDITIONAL ADDRESS 2', addressTypes));
        addressTypeIds.push(idname.getIdFromName('ADDITIONAL ADDRESS 3', addressTypes));
        addressTypeIds.push(idname.getIdFromName('ADDITIONAL ADDRESS 4', addressTypes));
        addressTypeIds.push(idname.getIdFromName('ADDITIONAL ADDRESS 5', addressTypes));
        addressTypeIds.push(idname.getIdFromName('ADDITIONAL ADDRESS 6', addressTypes));
        return addressTypeIds;
      });
    };

    /**
     * @ngdoc method
     * @name getPrimaryAddress
     * @methodOf gcms.components.address.service:address
     * @description Gets the primary address from an array of addresses
     * @returns {object} The primary address
     */
    var getPrimaryAddress = function(addresses){
      return getAddressTypeIds()
      .then(function(addressTypeIds){
        var address = addresses.find(function(item){
          return item.addressTypeID === addressTypeIds[0];
        });
        return address;
      });
    };

    return {
      getAddressTypeIds: getAddressTypeIds,
      getPrimaryAddress: getPrimaryAddress
    };

  }

})();
