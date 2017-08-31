/**
* @ngdoc service
* @name gcms.components.length.service:length
*
* @description
* Represents a length service.
* This service is responsible for returning a length of TextBox,TextArea etc.
*/
(function() {
  'use strict';

  angular
    .module('gcms.components.controls')
    .factory('length', length);

  length.$inject = ['$rootScope'];

  /**
   * @ngdoc method
   * @name state
   * @methodOf gcms.components.length.service:length
   * @description Constructor for state service
   * @param {object} $rootScope An execution context providing separation between the model and the view
   * @returns {object} The length service
   */
  function length($rootScope) {
    var attributeMap = false;

    /**
     * @ngdoc method
     * @name get
     * @methodOf gcms.components.length.service:length
     * @description Gets length based on an attribute name corresponding to a country/role
     * @param {string} attributeName The attribute name
     * @param {string} type The attribute type string/number
     * @returns {string} The length
     */
    function getLength (attributeName,type){
      return $rootScope.session.user.getCurrentProfile()
      .then(function(profile){
        var countryId = profile.countryId;
        return $rootScope.session.user.getAttributes(countryId);
      })
      .then(function(attributes){
        attributeMap = {};
        attributes.forEach(function(value){
              if(value.attributeName===attributeName){
            	 // attributeMap[value.attributeName] = 10;}
         attributeMap[value.attributeName] = value.maxLength;}
        });

        var result = '';
        result=attributeMap[attributeName];
       /* if(type==="number"){
         if(typeof  result ==="number");
         result=result+3;
        }*/
        return result;
      });
    }

    return {
      getLength: getLength
    };
  }
})();
