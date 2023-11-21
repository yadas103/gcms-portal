/**
 * @ngdoc overview
 * @name gcms.components.modal.controller:ModalDefaultCtrl
 *
 * @description
 * Represents a default modal controller.
 */
(function() {
	'use strict';

	angular.module('gcms.components.modal').controller('ModalDefaultCtrl',
			ModalDefault);
	
	ModalDefault.$inject = [ '$rootScope','$scope','SendEmailItem', '$modalInstance', '$timeout', 'item','ENVIRONMENT','toasty','$state','localeMapper','$window'];
	
	

	/**
	 * @ngdoc method
	 * @name ModalDefault
	 * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
	 * @description Constructor for the default modal controller
	 * @param {object} $scope An object that refers to the application model
	 * @param {object} $modalInstance An object which represents a modal window instance
	 * @param {object} item The object received from the modal directive controller
	 */
	function ModalDefault($rootScope,$scope,SendEmailItem, $modalInstance, $timeout, item, gTranslate, ENVIRONMENT,toasty,localeMapper) {
		$scope.locale = localeMapper.getCurrentISOCode();
		$scope.item = item;
		if(angular.isArray($scope.item)){
			$scope.checkConflictedData = findConflicts($scope.item);
			$scope.copyOfConflictedData =angular.copy($scope.checkConflictedData)
			$scope.displayedCollection = [].concat($scope.checkConflictedData);
			console.log("*********display Collection***********");
			console.log($scope.displayedCollection);
			$scope.columns = Object.keys($scope.displayedCollection[0]);
			$scope.columns.push("Status");
			console.log("******columns*********");
			console.log($scope.columns);
			$scope.columSearches ={};
			angular.forEach($scope.columns, function(column){
				$scope.columSearches[column] = {term: ''};
			});
		}
		$scope.filteredItems='';
		$scope.checkConflictedData=[];
		$scope.array = '';
		$scope.emailsuccess= false;
		// $scope.search ={};
	
		
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
		$scope.ok = function(item) {
			$scope.item = (typeof item === 'undefined') ? $scope.item : item;
			$modalInstance.close($scope.item);
		};
		$scope.add = function(newValue) {
			var obj = {};
			obj.Name = newValue;
			obj.Value = newValue;
			$scope.Groups.push(obj);
			$scope.group.name = obj;
			$scope.newValue = '';
		};

		$scope.Groups = [ {
			Name : 'Wrong name selected',//gTranslate('Wrong name selected',$rootScope.translationData,'Wrong name selected'),
			Value : 'd1'
		}, {
			Name : 'Event canceled',
			Value : 'A2'
		}, {
			Name : 'No payment',
			Value : 'c3'
		}, {
			Name : 'Other reason',
			Value : 'new'
		} ];
		$scope.group = {
			name : ""
		};
		$scope.add = function(new1Value) {
			var obj = {};
			obj.Name = new1Value;
			obj.Value = new1Value;
			$scope.Groupss.push(obj);
			$scope.group1.name = obj;
			$scope.new1Value = '';
		};

		$scope.Groupss = [ {
			Name : 'HCP',
			Value : 'd1'
		}, {
			Name : 'HCO',
			Value : 'new1'
		} ];
		$scope.group1 = {
			name : ""
		};
		$scope.tableRowExpanded = false;
		$scope.tableRowIndexCurrExpanded = "";
		$scope.tableRowIndexPrevExpanded = "";
		$scope.storeIdExpanded = "";
		$scope.dayDataCollapse = [];

		$scope.dayDataCollapseFn = function() {
			for (var i = 0; $scope.dataModel.ConsentAnnex.length - 1; i += 1) {
				$scope.dayDataCollapse.append('true');

			}
		};

		$scope.selectTableRow = function(index, storeId) {

			if ($scope.dayDataCollapse === 'undefined') {
				$scope.dayDataCollapse = $scope.dayDataCollapseFn();

			} else {

				if ($scope.tableRowExpanded === false
						&& $scope.tableRowIndexCurrExpanded === ""
						&& $scope.storeIdExpanded === "") {
					$scope.tableRowIndexPrevExpanded = "";
					$scope.tableRowExpanded = true;
					$scope.tableRowIndexCurrExpanded = index;
					$scope.storeIdExpanded = storeId;
					$scope.dayDataCollapse[index] = true;

				} else if ($scope.tableRowExpanded === true) {
					if ($scope.tableRowIndexCurrExpanded === index
							&& $scope.storeIdExpanded === storeId) {

						$scope.tableRowExpanded = false;
						$scope.tableRowIndexCurrExpanded = "";
						$scope.storeIdExpanded = "";
						$scope.dayDataCollapse[index] = false;

					} else {

						$scope.tableRowIndexPrevExpanded = $scope.tableRowIndexCurrExpanded;
						$scope.tableRowIndexCurrExpanded = index;
						$scope.storeIdExpanded = storeId;
						$scope.dayDataCollapse[$scope.tableRowIndexPrevExpanded] = false;
						$scope.dayDataCollapse[$scope.tableRowIndexCurrExpanded] = true;

					}

				}

			}
		};

		$scope.profileModle = {

			"BusinessProfile" : [ {
				"Tname" : "123",
				"DR" : "xyz",
				"QRcode" : "231",
				"conpage" : "",
				"Tcode" : "",

			}, {
				"Tname" : "234",
				"DR" : "Consent Form",
				"QRcode" : "23",
				"conpage" : "",
				"Tcode" : "",

			}, {
				"Tname" : "369",
				"DR" : "BG",
				"QRcode" : "123",
				"conpage" : "",
				"Tcode" : "",

			}, ]

		};
		
		$scope.emailObj={
				"CountryCode": "",
				"templatetype": "",
				"Message": "",
				"EmailListData": [{

						"Email": "",
						"UniqueId": "",
						"data": [{ }]
				}]
		}
		

		
	
		
		$scope.sendAll = function(item){
			
			$scope.success = '';
			$scope.error = '';
			var EMAIL_REGEX = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
            + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
			
			let emailListCopy =[];
			$scope.item.emailListData.forEach(Element =>{
				if(Element.email.match(EMAIL_REGEX)){
					emailListCopy.push(Element);
				}
			});
			if($scope.item.emailListData.length == emailListCopy.length){
				return SendEmailItem.query(item).$promise.then(function(result){
					// console.log(result[0].errors);
					if(result[0].errors != null){
						alert("email sent successfully")
						console.log(toasty);
						// toasty.success({
						// 	title: 'Success',
						// 	msg: 'Email successfully sent to all recipients ',
						// 	showClose: true,
						// 	clickToClose: true,
						// 	timeout: 5000,
						// 	sound: false,
						// 	html: false,
						// 	shake: false,
						// 	theme: 'bootstrap'
						// });
						$scope.ok(item);
						// $scope.emailsuccess = true;
					}
					else{
						toasty.error({
							title: 'Error',
							msg: 'Error',
							showClose: true,
							clickToClose: true,
							timeout: 5000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
					}
					
				});
			}
			else{
				alert("Recipient list contains invalid email....");
			}
		};
		
	

		/**
		 * @ngdoc method
		 * @name cancel
		 * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
		 * @description
		 * Dismisses the modal
		 */
		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
		/*select all checkbox*/

		$scope.checkAll = function() {
			angular.forEach($scope.item, function(c) {
				c.select = $scope.selectAll;
			});
		};

		function findConflicts(data){ 
			$scope.errorDataArray= [];
			
			const emailToIds = {};
			const idToEmails ={};
			const conflictedEmails = new Set();
			const conflictedIds = new Set();
			data.forEach(item =>{
				if((item.Email!= undefined && item.Email!=null && item.Email!="") && (item.UniqueID!= undefined && item.UniqueID!=null && item.UniqueID!="")){
					if(!emailToIds[item.Email]){
						emailToIds[item.Email] = [item.UniqueID];
					}else if(!emailToIds[item.Email].includes(item.UniqueID)){
						conflictedEmails.add(item.Email);
					}
					if(!idToEmails[item.UniqueID]){
						idToEmails[item.UniqueID] = [item.Email];
					}else if(!idToEmails[item.UniqueID].includes(item.Email)){
						conflictedIds.add(item.UniqueID);
					}
					// if(item.Email == null){
					// 	conflictedIds.add(item.UniqueID);
					// }
				}
				
			});
			
			data.forEach(item =>{
				if(item.Country == null || item.Country == undefined || angular.lowercase(item.Country) != $scope.locale){
					item.hasConflict = true;
					item.Status = "Country is missing or country mismatch";
					$scope.errorDataArray.push(item);
				}
				
				if(item.UniqueID == null || item.UniqueID == undefined){
					item.hasConflict = true;
					item.Status = "Unique id is missing";
					$scope.errorDataArray.push(item);
				}
				if(item.Email == null || item.Email == undefined){
					item.hasConflict = true;
					item.Status = "Email is missing";
					$scope.errorDataArray.push(item);
				}
				if(item.RecipientName == null || item.RecipientName == undefined){
					item.hasConflict = true;
					item.Status = "Recipient Name is missing";
					$scope.errorDataArray.push(item);
				}
				if(conflictedEmails.has(item.Email)){
					item.hasConflict = true;
					item.Status = "This email is associated with multiple unique id";
					$scope.errorDataArray.push(item);
				}
				if(conflictedIds.has(item.UniqueID)){
					item.hasConflict = true;
					item.Status = "This unique id is associated with multiple email";
					$scope.errorDataArray.push(item);
				}
				if(item.Email != null || item.Email!=undefined){
					let email = item.Email.replace(/^\s+|\s+$/gm,'');	
					var EMAIL_REGEX = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
					+ "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
					if(!email.match(EMAIL_REGEX)){
						item.hasConflict = true;
						item.Status = "Invalid email"
						$scope.errorDataArray.push(item);
					}
				}

			});
				
			return data;
		}
		$scope.displayBack =false;
		$scope.showErrors = function(){	
			$scope.item =$scope.errorDataArray;
			$scope.displayBack = true;
			$scope.displayError = false;
		}
		$scope.displayError = true;
		$scope.back = function(){
			$scope.item = $scope.copyOfConflictedData;
			$scope.displayError = true;
			$scope.displayBack = false;
		}
	}
	
})();
