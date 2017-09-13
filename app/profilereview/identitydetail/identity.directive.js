/**
* @ngdoc directive
* @name gcms.landing.directive:gcmsIdentityRequest
* @scope
* @restrict E
* 
 * @description Represents a IdentityRequest directive which displays a
*              IdentityRequest message to the user. Calling this directive
*              produces the following output
* 
 * ```html <div class="IdentityRequest-message"> <img
* src="assets/img/gcms_logo.png" class="center-block" width="495px"
* height="365px" alt="Pfizer"/> <div>
* <h2>{{IdentityRequest.title}}</h2>
* <span gcms-secure section-name="Landing" action-name="update"> <gcms-modal
* template="landing.IdentityRequest.html" controller="ModalDefaultCtrl"
* content="IdentityRequest" ok="update" alt="Edit IdentityRequest"> <i
* class='fa fa-pencil'></i> </gcms-modal> </span> </div>
* <p>
* {{IdentityRequest.message}}
* </p>
* </div> ```
* 
 * @param {closure=}
*            update the closure which is called when the message is updated
*/
(function() {

      'use strict';

      angular.module('gcms.identity')
      .directive('gcmsRequest',IdentityRequestProfile);

      IdentityRequestProfile.$inject = [ 'IdentityRequest','$state','$stateParams' ];

      /**
      * @ngdoc method
      * @name IdentityRequestMsg
      * @methodOf gcms.landing.directive:gcmsIdentityRequest
      * @description Constructor for the gcmsIdentityRequest directive
      * @param {object}
      *            IdentityRequest The IdentityRequest data service
      * @returns {object} IdentityRequest directive
      */
      function IdentityRequestProfile(IdentityRequest,$state,$stateParams) {
    	  return {
    	        restrict: 'E',
    	        scope: {
    	          item: '@',
    		      criteria: '=',
    		      result: '&',
    		      source: '=',
    	          'update': '&'
    	        },
                  templateUrl : 'app/profilereview/identitydetail/identityProfile.html',
                  controller : function($scope) {

                        $scope.tableRowExpanded = false;
                        $scope.tableRowIndexCurrExpanded = "";
                        $scope.tableRowIndexPrevExpanded = "";
                        $scope.storeIdExpanded = "";
                        $scope.dayDataCollapse = [];
                        $scope.editing = false;
                        $scope.newField = [];
                        $scope.sortType     = 'name'; // set the default sort type
                        $scope.sortReverse  = false;  // set the default sort order
                        $scope.searchFish   = '';     // set the default search/filter term
                        $scope.item = {};
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

                        /*$scope.editIdentityProfile = function(field) {
                              $scope.editing = $scope.identityRequest.indexOf(field);
                              $scope.newField[$scope.editing] = angular.copy(field);
                        };*/
                        

                        var updateIdentityRequest = function(result) {
                              $scope.identityRequest = result;
                        };

                        var loadIdentityRequest = function() {
                              $scope.identityRequest = [];
                              IdentityRequest.query().$promise
                                          .then(updateIdentityRequest);
                        };

                        loadIdentityRequest();

                        $scope.$on('$localeChangeSuccess', loadIdentityRequest);

                        /**
                        * @ngdoc method
                        * @name update
                        * @methodOf gcms.landing.directive:gcmsIdentityRequest
                        * @description Updates IdentityRequest status
                        * @param {object}
                        *            item IdentityRequest object
                        */
                        $scope.update = function(identityRequest) {
                              $scope.identityRequest = identityRequest;
                              IdentityRequest.update({
                                    id : item.id
                              }, item);
                        };
                        $scope.update = function(item) {
                            angular.forEach($scope.identityRequest, function(identityRequest){
                              if (identityRequest.id === item.id) {
                            	  identityRequest.updatedDate = new Date();
                                
                              }
                            });
                            identityRequest.update({ id:item.id }, item);
                          };
                        /**
                         * @ngdoc method
                         * @name ok
                         * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
                         * @description
                         * Closes the modal and returns the item
                         */
                        /*$scope.ok = function (identityRequest) {
                          $scope.identityRequest  = (typeof identityRequest === 'undefined') ? $scope.identityRequest : identityRequest;
                          $uibmodalInstance.close($scope.identityRequest);
                        };*/

                        /**
                         * @ngdoc method
                         * @name cancel
                         * @methodOf gcms.components.modal.controller:ModalDefaultCtrl
                         * @description
                         * Dismisses the modal
                         */
                        /*$scope.cancel = function () {
                          $uibmodalInstance.dismiss('cancel');
                        };*/
                        // populate $scope request property
                        if ($scope.criteria !== undefined){
                          $scope.item = $scope.criteria;
                        }
                        console.log('$scope.criteria'+$scope.criteria);
                        $scope.source = $scope.source || 'app/profilereview/identitydetail/identityProfile.html';

                        /**
                         * @ngdoc method
                         * @name submit
                         * @methodOf trs.recipient.directive:trsRecipientSearch
                         * @description Builds criteria and submits recipient search form
                         */
                        $scope.validate = function(item) {
                          var criteria = {};
                          alert("inside valide dir");
                          console.log(item);
                          for(var i in item){
                            if (
                              typeof item[i] === 'string' ||
                              typeof item[i] === 'boolean' ||
                              (typeof item[i] === 'number' && item[i] !== 0)
                            ){
                              criteria[i] = item[i];
                              console.log(item[i]);
                            }
                          }
                          $stateParams.criteria = JSON.stringify(criteria);
                          $state.go('identityProfiles', {criteria: JSON.stringify(criteria) } );
                          console.log('criteria' + criteria);
                        };
                  }

            }
      };
})();
