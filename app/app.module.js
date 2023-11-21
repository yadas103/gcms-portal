/**
 * @ngdoc overview
 * @name gcms
 *
 * @description
 * Represents the root application module.
 */
(function () {
  'use strict';

  angular
    .module('gcms', [
	  'ui.router',
      'ngIdle',
      'pascalprecht.translate',
      'tmh.dynamicLocale',
      'angular-inview',
      'angular-loading-bar',
      'isoCurrency',
      'smart-table',
      'angular-toasty',
      'gcms.environment',
	  'gcms.components.address',
	  'gcms.components.controls',
      'gcms.components.data',
      'gcms.components.modal',
      'gcms.components.permission',
      'gcms.components.popover',	  
	  'gcms.components.session',
	  'gcms.components.state',
	  'gcms.components.limittext',
      'gcms.components.locale',
	  'gcms.components.idname',
      'gcms.components.uniqueid',
      'gcms.components.uniqueidupload',
      'gcms.components.validator',	  
      'gcms.landing',
	  'gcms.profile',
	  'gcms.identity',
	  'gcms.task',
	  'gcms.administration',
	  'gcms.help',
	  'gcms.notification',
	 
	  'gcms.pre-administration',
	  'gcms.consentmgmt',
	  'ngJsonExportExcel',
	  'dctmNgFileManager',
	  'ngFileSaver', 
	  'dctmRestClient',	  
	  'moment-picker',
	  'ngDialog',
	  'mgcrea.ngStrap.popover'
    ]);
})();

