/**
 * @ngdoc service
 * @name gcms.components.uniqueid.service:uniqueid
 *
 * @description
 * Represents a uniqueid service.
 * This service determines the appropriate unique id (type and value) to display.
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.uniqueid')
    .factory('uniqueid', Uniqueid);

  Uniqueid.$inject = ['$rootScope', '$q', 'idname'];

  /**
    * @ngdoc method
    * @name Uniqueid
    * @methodOf gcms.components.uniqueid.service:uniqueid
    * @description Constructor for the uniqueid service
    * @param {object} $rootScope A root object that refers to the application model.
    * It is an execution context for expressions. Scopes are arranged in a hierarchical structure which mimic the DOM structure of the application.
    * @param {object} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
    * @param {object} idname A service for getting the name from the id and the id from the name
    * @returns {object} The uniqueid service
    */
  function Uniqueid($rootScope, $q, idname) {

    /**
      * @ngdoc method
      * @name getDefaultUniqueId
      * @methodOf gcms.components.uniqueid.service:uniqueid
      * @description Gets uniqueId object based on a recipient.
      * @param {object} recipient The covered recipient
      * @returns {object} The uniqueId object
      */
    function getDefaultUniqueId(recipient) {
      var addresses = recipient.addresses;
      var uniqueIds = recipient.uniqueIdentifiers;
      var partyTypeCode = recipient.businessPartyTypeCode;

      if (partyTypeCode === 'HCP') {partyTypeCode = 'PERSON';}
      if (partyTypeCode === 'HCO') {partyTypeCode = 'ORGANIZATION';}

      if (addresses.length > 0 && uniqueIds.length > 0){
        return $rootScope.session.collections.addressType().then(function(types){
          var countryId = getPrimaryAddressCountryId(addresses, types);
          return $q.all([countryId, $rootScope.session.collections.country()]);
        }).then(function(result){
          var country = result[1].find(function(item){ return item.id === result[0]; });
          var displayUniqueIdentifierTypes = country.displayUniqueIdentifierType;

          // sort all unique ids based on created date
          uniqueIds = sortUniqueIds(uniqueIds);

          // find appropriate unique id
          var primaryUniqueId = getRecipientUniqueId(uniqueIds, displayUniqueIdentifierTypes, result[0], partyTypeCode, 'PRIMARY');
          if (primaryUniqueId){
            return $q.when(primaryUniqueId);
          } else {
            var secondaryUniqueId = getRecipientUniqueId(uniqueIds, displayUniqueIdentifierTypes, result[0], partyTypeCode, 'SECONDARY');
            if (secondaryUniqueId){
              return $q.when(secondaryUniqueId);
            } else {
              return $q.when(uniqueIds[0]);
            }
          }
        });
      } else {
        return $q.when({uniqueIdTypeID: 0, value: 'N/A'});
      }
    }

    /**
      * @ngdoc method
      * @name getPrimaryAddressCountryId
      * @methodOf gcms.components.uniqueid.service:uniqueid
      * @description Gets country id from recipient primary address.
      * @param {Array} recipientAddresses The recipient addresses
      * @param {Array} addressTypes The addressTypes array
      * @returns {Number} The country id
      */
    var getPrimaryAddressCountryId = function(recipientAddresses, addressTypes){
      var primaryAddressTypeId = idname.getIdFromName('PRIMARY ADDRESS', addressTypes);
      var address = recipientAddresses.find(function(item){ return item.addressTypeID === primaryAddressTypeId; });
      return address.countryId;
    };

    /**
      * @ngdoc method
      * @name getRecipientUniqueId
      * @methodOf gcms.components.uniqueid.service:uniqueid
      * @description Gets recipient unique id based on country id, party type, and priority
      * @param {Array} recipientUniqueIds The recipient unique ids
      * @param {Array} countryUniqueIdTypes The unique id types array for a specific country
      * @param {Number} countryId The country id
      * @param {String} partyTypeCode The party type code (e.g., "PERSON" or "ORGANIZATION")
      * @param {priority} priority The display priority (e.g., "PRIMARY" or "SECONDARY")
      * @returns {object} The unique id object
      */
    var getRecipientUniqueId = function(recipientUniqueIds, countryUniqueIdTypes, countryId, partyTypeCode, priority){
      var uniqueIdentifierType = countryUniqueIdTypes.find(function(item){
        return item.countryId === countryId && item.partyTypeCode === partyTypeCode && item.displayPriorityCode === priority;
      });
      var uniqueIdTypeId = uniqueIdentifierType ? uniqueIdentifierType.uniqueIdentifierTypeID : 0;
      var uniqueId = recipientUniqueIds.find(function(item){ return item.uniqueIdTypeID === uniqueIdTypeId; });
      return uniqueId;
    };

    /**
      * @ngdoc method
      * @name sortUniqueIds
      * @methodOf gcms.components.uniqueid.service:uniqueid
      * @description Sorts the recipients unique ids based on created date in descending order
      * @param {Array} recipientUniqueIds The recipient unique ids
      * @returns {Array} The recipients unique ids
      */
    var sortUniqueIds = function(recipientUniqueIds){
      var sortedUniqueIds = recipientUniqueIds.sort(function (a, b) {
        if (a.createdDate > b.createdDate) {
          return 1;
        }
        if (a.createdDate < b.createdDate) {
          return -1;
        }
        return 0;
      });
      return sortedUniqueIds;
    };

    return {
      getDefaultUniqueId: getDefaultUniqueId
    };
  }
})();
