/**
 * @ngdoc directive
 * @name gcms.recipient.directive:gcmsRecipientSearch
 * @restrict E
 *
 * @description
 * Represents a recipient search directive.
 * Displays a recipient search form to a user.
 *
 * ```html
 <form name="requestSearchForm" class="form-horizontal" ng-submit="submit(request)">

   <div class="form-group" ng-if="source !== 'recipient.box.html' && source !== 'exchange.payment.html'">
     <label for="type" class="col-sm-3 control-label">Type</label>
     <div class="col-sm-9">
       <gcms-lov list="recipientType" value="request.businessPartyType"></gcms-lov>
     </div>
   </div>

   <div class="form-group" ng-if="!request.businessPartyType || request.businessPartyType === 1">
     <label for="firstName" class="col-sm-3 control-label">First Name</label>
     <div class="col-sm-9">
       <input type="text" class="form-control" id="firstName" ng-model="request.firstName">
     </div>
   </div>

   <div class="form-group" ng-if="!request.businessPartyType || request.businessPartyType === 1">
     <label for="middleName" class="col-sm-3 control-label">Middle Name</label>
     <div class="col-sm-9">
       <input type="text" class="form-control" id="middleName" ng-model="request.middleName">
     </div>
   </div>

   <div class="form-group" ng-if="!request.businessPartyType || request.businessPartyType === 1">
     <label for="lastName" class="col-sm-3 control-label">Last Name</label>
     <div class="col-sm-9">
       <input type="text" class="form-control" id="lastName" ng-model="request.lastName">
     </div>
   </div>

   <div class="form-group" ng-if="!request.businessPartyType || request.businessPartyType === 2">
     <label for="organizationName" class="col-sm-3 control-label">Organization Name</label>
     <div class="col-sm-9">
       <input type="text" class="form-control" id="organizationName" ng-model="request.organizationName">
     </div>
   </div>

   <div class="form-group">
     <label class="col-sm-3 control-label">Location</label>
     <div class="col-sm-9">
       <input type="text" class="form-control" id="address" ng-model="request.address" placeholder="Address">
     </div>
   </div>

   <div class="form-group">
     <label class="col-sm-3"></label>
     <div class="col-sm-3">
       <input type="text" class="form-control" id="city" ng-model="request.city" placeholder="City">
     </div>
     <div class="col-sm-3">
       <input type="text" class="form-control" id="region" ng-model="request.region" placeholder="Region">
     </div>
     <div class="col-sm-3">
       <input type="text" class="form-control" id="zip" ng-model="request.zip" placeholder="Zip">
     </div>
   </div>

   <div class="form-group">
     <label class="col-sm-3 control-label">Unique ID</label>
     <div class="col-sm-5">
       <gcms-lov list="uniqueid" value="request.uniqueID"></gcms-lov>
     </div>
     <div class="col-sm-4">
       <input type="text" class="form-control" id="uniqueId" ng-model="request.uniqueIDValue" placeholder="Unique ID Value">
     </div>
   </div>

   <div class="form-group" ng-if="!request.businessPartyType || request.businessPartyType === 1">
     <label class="col-sm-3 control-label">Specialty</label>
     <div class="col-sm-9">
       <gcms-lov list="specialty" value="request.specialty"></gcms-lov>
     </div>
   </div>

   <div class="form-group">
     <label class="col-sm-3 control-label">Completion Status</label>
     <div class="col-sm-9">
       <gcms-lov list="completionStatus" value="request.completed"></gcms-lov>
     </div>
   </div>

   <div class="form-group">
     <label class="col-sm-3 control-label">Locked Status</label>
     <div class="col-sm-9">
       <gcms-lov list="lockedStatus" value="request.locked"></gcms-lov>
     </div>
   </div>

   <div class="form-group">
     <label class="col-sm-3 control-label">Consent Status</label>
     <div class="col-sm-9">
       <gcms-lov list="consentType" value="request.consentStatusID"></gcms-lov>
     </div>
   </div>

   <div class="form-group">
     <div class="col-sm-3"></div>
     <div class="col-sm-5" ng-if="source !== 'components.search.html' && source !== 'exchange.payment.html'">
       <div class="checkbox">
         <label>
           <input type="checkbox" id="isIncludeInactiveProfiles" ng-model="request.inActiveProfile"> Include Inactive Profiles
         </label>
       </div>
     </div>
     <div class="col-sm-4">
       <div class="pull-right">
         <gcms-modal template="merge.recipient.html" content="request" controller="ModalDefaultCtrl" ok="modalSubmit" alt="Search Recipients" ng-if="source === 'recipient.box.html'">
           <span class="btn btn-default ng-scope" role="button"><i class="fa fa-search fa-2x"></i></span>
         </gcms-modal>
         <gcms-modal template="component.recipients.html" content="request" controller="ModalDefaultCtrl" ok="modalSubmit" alt="Search Recipients" ng-if="source === 'components.search.html' || source === 'exchange.payment.html'">
           <span class="btn btn-default ng-scope" role="button"><i class="fa fa-search fa-2x"></i></span>
         </gcms-modal>
         <button type="submit" class="btn btn-lg btn-default" alt="Search" ng-if="source === 'recipient.search.html'"><i class="fa fa-search fa-2x"></i></button>
       </div>
     </div>
   </div>

 </form>
 *```
 *
 */
(function () {

  'use strict';

  angular
    .module('gcms.recipient')
    .directive('gcmsRecipientSearch', RecipientSearch);

    RecipientSearch.$inject = ['$state'];

    /**
     * @ngdoc method
     * @name RecipientSearch
     * @methodOf gcms.recipient.directive:gcmsRecipientSearch
     * @description Constructor for gcmsRecipientSearch directive
     * @param {object} $state Represents the state of the router
     * @returns {object} Recipient search directive
     */
    function RecipientSearch($state) {
      return {
        restrict: 'E',
        scope: {
          request: '@',
          criteria: '=',
          result: '&',
          source: '=',
          recipientId: '@'
        },
        templateUrl: 'app/recipient/components/search/recipient.search.html',
        controller: function($scope) {

          // scope variables
          $scope.request = {};

          // populate $scope request property
          if ($scope.criteria !== undefined){
            $scope.request = $scope.criteria;
          }
          
          $scope.source = $scope.source || 'recipient.search.html';

          /**
           * @ngdoc method
           * @name submit
           * @methodOf gcms.recipient.directive:gcmsRecipientSearch
           * @description Builds criteria and submits recipient search form
           */
          $scope.submit = function(request) {
            var criteria = {};

            for(var i in request){
              if (
                typeof request[i] === 'string' ||
                typeof request[i] === 'boolean' ||
                (typeof request[i] === 'number' && request[i] !== 0)
              ){
                criteria[i] = request[i];
              }
            }

            criteria.isModal = $scope.isModal;

            $state.go('recipient-results', {criteria: JSON.stringify(criteria) } );
          };

          /**
           * @ngdoc method
           * @name modalSubmit
           * @methodOf gcms.recipient.directive:gcmsRecipientSearch
           * @description Submits recipient search form when form is in a modal
           */
          $scope.modalSubmit = function(item){
            $scope.result()(item);
          };

          /**
           * @ngdoc method
           * @methodOf gcms.recipient.directive:gcmsRecipientSearch
           * @description Sets the recipient id of the request object
           */
          $scope.$watch('recipientId', function(value){
            if(!value) { return; }
            $scope.request.recipientId = value;
          });

          /**
           * @ngdoc method
           * @methodOf gcms.recipient.directive:gcmsRecipientSearch
           * @description Deleted properties fron the request object as necessary
           */
          $scope.$watch('request.businessPartyType', function(value){
            switch(value){
              case null:
                delete $scope.request.businessPartyType;
                break;
              case 1: //person
                delete $scope.request.organizationName;
                break;
              case 2: //organization
                delete $scope.request.firstName;
                delete $scope.request.middleName;
                delete $scope.request.lastName;
                delete $scope.request.specialtyID;
                break;
            }
          });
        }
     };
   }

})();
