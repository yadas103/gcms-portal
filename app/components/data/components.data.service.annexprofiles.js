(function() {
  'use strict';

  angular
    .module('gcms.components.data')
    .factory('myService', myService);

    function myService() {
    	 var id = {};
    	 
    	 function set(data) {
    		 id = {};
    	   id = data;
    	 }
    	 function get() {
    	  return id;
    	 }
    	     	 
    	 return {
    	  set: set,
    	  get: get
    	 };

    	}
})();