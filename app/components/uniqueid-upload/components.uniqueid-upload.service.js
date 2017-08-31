/**
 * @ngdoc service
 * @name gcms.components.uniqueid.service:uniqueid
 *
 * @description
 * This service determines the appropriate unique id (type and value) to display.
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.uniqueidupload')
    .factory('uniqueidupload', UniqueidUpload);

  UniqueidUpload.$inject = ['$rootScope', '$q'];

  /**
    * @ngdoc method
    * @name UniqueidUpload
    * @methodOf gcms.components.uniqueid.service:uniqueid
    * @description Constructor for the uniqueidupload service
    * @param {object} $rootScope A root object that refers to the application model.
    * It is an execution context for expressions. Scopes are arranged in a hierarchical structure which mimic the DOM structure of the application.
    * @param {object} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
    * @returns {object} The uniqueidupload service
    */
  function UniqueidUpload($rootScope, $q) {
    /**
      * @ngdoc method
      * @name getUploadDefaultUniqueId
      * @methodOf gcms.components.uniqueid.service:uniqueid
      * @description Gets uniqueId object based on properties from incomplete/rejected object.
      * @param {object} recipient The covered recipient
      * @returns {object} The uniqueId object
      */
    function getUploadDefaultUniqueId(recipient) {
      // private variables
      var partyType = null;
      var partyCountryCode = null;
      var uniqueIDType = null;
      var uniqueIDType2 = null;
      var uniqueIDType3 = null;
      var uniqueIDType4 = null;
      var uniqueIDType5 = null;
      var uniqueIDType6 = null;
      var uniqueIDType7 = null;
      var uniqueIDType8 = null;
      var uniqueIDType9 = null;
      var uniqueIDType10 = null;
      var uniqueIdValue = null;
      var uniqueIdValue2 = null;
      var uniqueIdValue3 = null;
      var uniqueIdValue4 = null;
      var uniqueIdValue5 = null;
      var uniqueIdValue6 = null;
      var uniqueIdValue7 = null;
      var uniqueIdValue8 = null;
      var uniqueIdValue9 = null;
      var uniqueIdValue10 = null;
      var recipientUniqueIds = [];

      // validate party type
      partyType = recipient.partyType || 'PERSON';
      partyType = partyType.toUpperCase().trim();
      if (partyType === 'HCP') {partyType = 'PERSON';}
      if (partyType === 'HCO') {partyType = 'ORGANIZATION';}

      //validate party country code
      partyCountryCode = recipient.partyCountryCode || 'US';
      partyCountryCode = partyCountryCode.toUpperCase().trim();

      //validate unique id types
      uniqueIDType = recipient.uniqueIDType || '';
      uniqueIDType2 = recipient.uniqueIDType2 || '';
      uniqueIDType3 = recipient.uniqueIDType3 || '';
      uniqueIDType4 = recipient.uniqueIDType4 || '';
      uniqueIDType5 = recipient.uniqueIDType5 || '';
      uniqueIDType6 = recipient.uniqueIDType6 || '';
      uniqueIDType7 = recipient.uniqueIDType7 || '';
      uniqueIDType8 = recipient.uniqueIDType8 || '';
      uniqueIDType9 = recipient.uniqueIDType9 || '';
      uniqueIDType10 = recipient.uniqueIDType10 || '';
      uniqueIDType = uniqueIDType.toUpperCase().trim();
      uniqueIDType2 = uniqueIDType2.toUpperCase().trim();
      uniqueIDType3 = uniqueIDType3.toUpperCase().trim();
      uniqueIDType4 = uniqueIDType4.toUpperCase().trim();
      uniqueIDType5 = uniqueIDType5.toUpperCase().trim();
      uniqueIDType6 = uniqueIDType6.toUpperCase().trim();
      uniqueIDType7 = uniqueIDType7.toUpperCase().trim();
      uniqueIDType8 = uniqueIDType8.toUpperCase().trim();
      uniqueIDType9 = uniqueIDType9.toUpperCase().trim();
      uniqueIDType10 = uniqueIDType10.toUpperCase().trim();

      //validate unique id values
      uniqueIdValue = recipient.uniqueIdValue || '';
      uniqueIdValue2 = recipient.uniqueIdValue2 || '';
      uniqueIdValue3 = recipient.uniqueIdValue3 || '';
      uniqueIdValue4 = recipient.uniqueIdValue4 || '';
      uniqueIdValue5 = recipient.uniqueIdValue5 || '';
      uniqueIdValue6 = recipient.uniqueIdValue6 || '';
      uniqueIdValue7 = recipient.uniqueIdValue7 || '';
      uniqueIdValue8 = recipient.uniqueIdValue8 || '';
      uniqueIdValue9 = recipient.uniqueIdValue9 || '';
      uniqueIdValue10 = recipient.uniqueIdValue10 || '';
      uniqueIdValue = uniqueIdValue.toUpperCase().trim();
      uniqueIdValue2 = uniqueIdValue2.toUpperCase().trim();
      uniqueIdValue3 = uniqueIdValue3.toUpperCase().trim();
      uniqueIdValue4 = uniqueIdValue4.toUpperCase().trim();
      uniqueIdValue5 = uniqueIdValue5.toUpperCase().trim();
      uniqueIdValue6 = uniqueIdValue6.toUpperCase().trim();
      uniqueIdValue7 = uniqueIdValue7.toUpperCase().trim();
      uniqueIdValue8 = uniqueIdValue8.toUpperCase().trim();
      uniqueIdValue9 = uniqueIdValue9.toUpperCase().trim();
      uniqueIdValue10 = uniqueIdValue10.toUpperCase().trim();

      // fill recipientUniqueIds array
      recipientUniqueIds.push({'name': uniqueIDType, 'value': uniqueIdValue});
      recipientUniqueIds.push({'name': uniqueIDType2, 'value': uniqueIdValue2});
      recipientUniqueIds.push({'name': uniqueIDType3, 'value': uniqueIdValue3});
      recipientUniqueIds.push({'name': uniqueIDType4, 'value': uniqueIdValue4});
      recipientUniqueIds.push({'name': uniqueIDType5, 'value': uniqueIdValue5});
      recipientUniqueIds.push({'name': uniqueIDType6, 'value': uniqueIdValue6});
      recipientUniqueIds.push({'name': uniqueIDType7, 'value': uniqueIdValue7});
      recipientUniqueIds.push({'name': uniqueIDType8, 'value': uniqueIdValue8});
      recipientUniqueIds.push({'name': uniqueIDType9, 'value': uniqueIdValue9});
      recipientUniqueIds.push({'name': uniqueIDType10, 'value': uniqueIdValue10});

      if (recipientUniqueIds.length > 0){
        return $rootScope.session.user.getCurrentProfile().then(function(profile){
          return $q.all([profile.countryId, $rootScope.session.collections.country(), $rootScope.session.collections.uniqueid()]);
        })
        .then(function(result){
          var countryId = result[0];
          var countries = result[1];
          var uniqueIds = result[2];
          var country = countries.find(function(item){ return item.id === countryId && item.isoCode === partyCountryCode; });
          var countryUniqueIdTypes = (typeof country !== 'undefined') ? country.displayUniqueIdentifierType : [];
          var recipientTypeAndValueUniqueIds = recipientUniqueIds.filter(function(item){
            if (item.name.length > 0 && item.value.length > 0){
              return item;
            }
          });
          var recipientTypeOnlyUniqueIds = recipientUniqueIds.filter(function(item){
            if (item.name.length > 0 && item.value.length === 0){
              return item;
            }
          });

          var primaryTypeAndValueUniqueId = getUniqueId(recipientTypeAndValueUniqueIds, countryUniqueIdTypes, uniqueIds, countryId, partyType, 'PRIMARY');
          if (primaryTypeAndValueUniqueId){
            return $q.when(primaryTypeAndValueUniqueId);
          } else {
            var primaryTypeOnlyUniqueId = getUniqueId(recipientTypeOnlyUniqueIds, countryUniqueIdTypes, uniqueIds, countryId, partyType, 'PRIMARY');
            if (primaryTypeOnlyUniqueId){
              return $q.when(primaryTypeOnlyUniqueId);
            } else {
              var secondaryTypeAndValueUniqueId = getUniqueId(recipientTypeAndValueUniqueIds, countryUniqueIdTypes, uniqueIds, countryId, partyType, 'SECONDARY');
              if (secondaryTypeAndValueUniqueId){
                return $q.when(secondaryTypeAndValueUniqueId);
              } else {
                var secondaryTypeOnlyUniqueId = getUniqueId(recipientTypeOnlyUniqueIds, countryUniqueIdTypes, uniqueIds, countryId, partyType, 'SECONDARY');
                if (secondaryTypeOnlyUniqueId){
                  return $q.when(secondaryTypeOnlyUniqueId);
                } else {
                  var sortedTypeAndValueUniqueIds = recipientTypeAndValueUniqueIds[0];
                  if (sortedTypeAndValueUniqueIds){
                    return $q.when(sortedTypeAndValueUniqueIds);
                  } else {
                    var sortedTypeOnlyUniqueIds = recipientTypeOnlyUniqueIds[0];
                    if (sortedTypeOnlyUniqueIds){
                      return $q.when(sortedTypeOnlyUniqueIds);
                    } else {
                      return $q.when({name: '', value:'N/A'});
                    }
                  }
                }
              }
            }
          }
        });
      } else {
        return $q.when({name: '', value:'N/A'});
      }
    }

    /**
      * @ngdoc method
      * @name getUniqueId
      * @methodOf gcms.components.uniqueid.service:uniqueid
      * @description Gets recipient unique id based on country id, party type, and priority
      * @param {Array} recipientUniqueIds The recipient unique ids
      * @param {Array} countryUniqueIdTypes The country unique ids
      * @param {Array} uniqueIds The unique id list of values
      * @param {Number} countryId The country id for the current profile
      * @param {String} partyTypeCode The party type code (e.g., "PERSON" or "ORGANIZATION")
      * @param {priority} priority The display priority (e.g., "PRIMARY" or "SECONDARY")
      * @returns {object} The unique id object
      */
    var getUniqueId = function(recipientUniqueIds, countryUniqueIdTypes, uniqueIds, countryId, partyTypeCode, priority){
        var countryUniqueIdTypeId = getCountryUniqueIdType(countryUniqueIdTypes, countryId, partyTypeCode, priority);
        var countryUniqueIdTypeName = getCountryUniqueIdTypeName(uniqueIds, countryUniqueIdTypeId);
        var recipientUniqueId = getRecipientUniqueId(recipientUniqueIds, countryUniqueIdTypeName);
        return recipientUniqueId;
    };

    // get country unique type id based on country, party type, and priority
    var getCountryUniqueIdType = function(countryUniqueIdTypes, countryId, partyTypeCode, priority){
      var countryUniqueIdType = countryUniqueIdTypes.find(function(item){
        return item.countryId === countryId && item.partyTypeCode === partyTypeCode && item.displayPriorityCode === priority;
      });
      var countryUniqueIdTypeId = (typeof countryUniqueIdType !== 'undefined') ? countryUniqueIdType.uniqueIdentifierTypeID : 0;
      return countryUniqueIdTypeId;
    };

    // get country unique id type name based on country unique id type id
    var getCountryUniqueIdTypeName = function(uniqueIds, countryUniqueIdTypeId){
      var lovUniqueIdType = uniqueIds.find(function(item){
        return item.id === parseInt(countryUniqueIdTypeId);
      });
      var countryUniqueIdTypeName = (typeof lovUniqueIdType !== 'undefined') ? lovUniqueIdType.name : '';
      return countryUniqueIdTypeName;
    };

    // get recipient unique id object
    var getRecipientUniqueId = function(recipientUniqueIds, countryUniqueIdTypeName){
      var recipientUniqueId = recipientUniqueIds.find(function(item){
        return item.name === countryUniqueIdTypeName;
      });
      return recipientUniqueId;
    };

    return {
      getUploadDefaultUniqueId: getUploadDefaultUniqueId
    };
  }
})();
