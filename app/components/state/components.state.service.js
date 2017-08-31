/**
 * @ngdoc service
 * @name gcms.components.state.service:state
 *
 * @description
 * Represents a state service.
 * This service is responsible for returning a state (critical, required, etc.) based on a attribute name.
 */
(function() {
  'use strict';

  angular
    .module('gcms.components.state')
    .factory('state', state);

  state.$inject = ['$rootScope', '$stateParams'];

  /**
   * @ngdoc method
   * @name state
   * @methodOf gcms.components.state.service:state
   * @description Constructor for state service
   * @param {object} $rootScope An execution context providing separation between the model and the view
   * @returns {object} The state service
   */
  function state($rootScope, $stateParams) {
    var attributeMap = false;

    /**
     * @ngdoc method
     * @name get
     * @methodOf gcms.components.state.service:state
     * @description Gets state based on an attribute name corresponding to a country/role
     * @param {string} attributeName The attribute name
     * @returns {string} The state
     */
    function get (attributeName){
      return $rootScope.session.user.getCurrentProfile()
      .then(function(profile){
        var countryId = profile.countryId;
        return $rootScope.session.user.getAttributes(countryId);
      })
      .then(function(attributes){
        attributeMap = {};
        attributes.forEach(function(value){
          attributeMap[value.attributeName] = value.criticalRequiredOptionalIndicator;
        });

        var result = '';

        switch(attributeMap[attributeName]){
          case 'H':
            result = 'hidden';
            break;
          case 'C':
            result = 'critical';
            break;
          case 'R':
            result = 'required';
            break;
          case 'O':
            result = 'optional';
            break;
          case 'V':
            result = 'view';
            break;
          default:
            result = 'not found';
            break;
        }

        if (result !== 'hidden' && $stateParams.isView) {
          result = 'view';
        }

        return result;
      });
    }

    return {
      get: get
    };
  }
})();
