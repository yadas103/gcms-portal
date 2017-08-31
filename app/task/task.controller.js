
(function () {
  'use strict';

  angular
    .module('gcms.task')
    .controller('TaskCtrl', TaskController);

  TaskController.$inject = ['$rootScope', '$scope','ConsentAnnex'];

  
  function TaskController($rootScope, $scope,ConsentAnnex){	  
	
	  var getData = function(){
		  
		     return ConsentAnnex.query().$promise.then(function(consent){
		       $scope.ConsentAttributes = consent;
		       console.log(consent);
		      });
		  };
	  
		 getData();              
    
  }
})();
