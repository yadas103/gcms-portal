/**
 * @ngdoc overview
 * @name trs.exchange.controller:ExchangeUploadsCtrl
 *
 * @description
 * Represents an exchange uploads controller.
 */
(function () {

  'use strict';

  angular
    .module('gcms.consentmgmt')
    .controller('ConsentMgmtCtrl', ConsentManagement);

  	ConsentManagement.$inject = ['$scope', 'localeMapper','$interval','$state','$rootScope'];

    /**
     * @ngdoc method
     * @name Uploads
     * @methodOf trs.exchange.controller:ExchangeUploadsCtrl
     * @description Constructor for the ExchangeUploadsCtrl controller
     * @param {object} $scope An execution context providing separation between the model and the view
     * @param {object} ExchangeUploads The uploads (exchange) data service
     * @returns {object} ExchangeUploadsCtrl controller
     */
    function ConsentManagement($scope, localeMapper,$interval,$state,$rootScope) {

      $scope.startRecord = 20;
      $scope.totalRecords = 100;
      $scope.locale = localeMapper.getCurrentISOCode();

    }

})();
