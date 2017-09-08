(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('myService', myService);

    function myService() {
    	 var savedData = {}
    	 function set(data) {
    	   savedData = data;
    	 }
    	 function get() {
    	  return savedData;
    	 }

    	 return {
    	  set: set,
    	  get: get
    	 };

    	}
})();