/**
 * @ngdoc overview
 * @name gcms.landing
 *
 * @description
 * Represents a landing module.
 */

(function () {

  'use strict';

  angular
    .module('gcms.task', [
                          'ui.bootstrap',
                          'gcms.components.data',
                          'smart-table',
                          'angularFileUpload'
                          ]);
}());
