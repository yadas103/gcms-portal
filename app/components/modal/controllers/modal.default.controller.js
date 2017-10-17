/**
 * @ngdoc overview
 * @name gcms.components.modal.controller:ModalDefaultCtrl
 *
 * @description
 * Represents a default modal controller.
 */
(function () {
  'use strict';

  angular
    .module('gcms.components.modal')
    .controller('ModalDefaultCtrl', ModalDefault);

    ModalDefault.$inject = ['$scope','$modalInstance','$timeout','item'];

    /**
     * @ngdoc method
     * @name ModalDefault
     * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
     * @description Constructor for the default modal controller
     * @param {object} $scope An object that refers to the application model
     * @param {object} $modalInstance An object which represents a modal window instance
     * @param {object} item The object received from the modal directive controller
     */
    function ModalDefault($scope,$modalInstance,$timeout, item) {
    	
      $scope.item = item;
      $scope.maxLength = 100;
      
      /*
       * selim
       * handdled for date
       */
      $scope.dt = new Date();
      $scope.startDate = function() {
    	    $timeout(function() {
    	      $scope.openedStart = true;
    	    });
    	  };
    	  $scope.openedStart = false;
    	  $scope.endDate = function() {
      	    $timeout(function() {
      	      $scope.openedEnd = true;
      	    });
      	  };
      	$scope.openedEnd = false;
    
      
      //hide popovers in case we came from there
      //$('.popover-link').popover('hide');
      $('.popover').hide();
      
      /**
       * @ngdoc method
       * @name ok
       * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
       * @description
       * Closes the modal and returns the item
       */
      $scope.ok = function (item) {
        $scope.item  = (typeof item === 'undefined') ? $scope.item : item;
        $modalInstance.close($scope.item);
      };
	  $scope.add = function (newValue) {
        var obj = {};
        obj.Name = newValue;
        obj.Value = newValue;
        $scope.Groups.push(obj);
        $scope.group.name = obj;
        $scope.newValue = '';
    }

    $scope.Groups = [{
        Name: 'Wrong name selected',
        Value: 'd1'
    }, {
        Name: 'Event canceled',
        Value: 'A2'
    }, {
        Name: 'No payment',
        Value: 'c3'
    },   {
        Name: 'Other reason',
        Value: 'new'
    }];
    $scope.group = {
        name: ""
    }
	$scope.add = function (new1Value) {
        var obj = {};
        obj.Name = new1Value;
        obj.Value = new1Value;
        $scope.Groupss.push(obj);
        $scope.group1.name = obj;
        $scope.new1Value = '';
    }

    $scope.Groupss = [{
        Name: 'HCP',
        Value: 'd1'
    },   {
        Name: 'HCO',
        Value: 'new1'
    }];
    $scope.group1 = {
        name: ""
    }
	 $scope.tableRowExpanded = false;
    $scope.tableRowIndexCurrExpanded = "";
    $scope.tableRowIndexPrevExpanded = "";
    $scope.storeIdExpanded = "";
    $scope.dayDataCollapse = [];
   

    $scope.dayDataCollapseFn = function () {
        for (var i = 0; $scope.dataModel.ConsentAnnex.length - 1; i += 1) {
            $scope.dayDataCollapse.append('true');
            
        }
    };
    
  
    
    $scope.selectTableRow = function (index, storeId) {
      
      

      if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
            
      } else {
    
    if ($scope.tableRowExpanded === false && $scope.tableRowIndexCurrExpanded === "" && $scope.storeIdExpanded === "") {
                $scope.tableRowIndexPrevExpanded = "";
                $scope.tableRowExpanded = true;
                $scope.tableRowIndexCurrExpanded = index;
                $scope.storeIdExpanded = storeId;
                $scope.dayDataCollapse[index] = true;
    
    }else if ($scope.tableRowExpanded === true) {
      if ($scope.tableRowIndexCurrExpanded === index && $scope.storeIdExpanded === storeId) {
        
                 $scope.tableRowExpanded = false;
                    $scope.tableRowIndexCurrExpanded = "";
                    $scope.storeIdExpanded = "";
                    $scope.dayDataCollapse[index] = false;
     
       }else{
         
                 $scope.tableRowIndexPrevExpanded = $scope.tableRowIndexCurrExpanded;
                    $scope.tableRowIndexCurrExpanded = index;
                    $scope.storeIdExpanded = storeId;
                    $scope.dayDataCollapse[$scope.tableRowIndexPrevExpanded] = false;
                    $scope.dayDataCollapse[$scope.tableRowIndexCurrExpanded] = true;
         
         
       }
     
      
    }
        
      }  
    };
    
    
    $scope.profileModle={
      
    "BusinessProfile" : [
{   "Tname": "123",
"DR": "xyz",
"QRcode": "231",
"conpage": "",
"Tcode": "",

},
{   
"Tname": "234",
"DR": "Consent Form",
"QRcode": "23",
"conpage": "",
"Tcode": "",

},
{   
"Tname": "369",
"DR": "BG",
"QRcode": "123",
"conpage": "",
"Tcode": "",

},
]
      
    };
    
    
  
  

  
  



      /**
       * @ngdoc method
       * @name cancel
       * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
       * @description
       * Dismisses the modal
       */
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
})();
