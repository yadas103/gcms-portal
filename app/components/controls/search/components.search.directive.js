/**
* @ngdoc directive
* @name gcms.components.controls.directive:gcmsSearch
* @scope
* @restrict E
*
* @description
* Provides a wrap for gcms-recipient-search directive for critical, required, and optional states.
* Provides a span element with content for view state.
*
* ```html
<div ng-switch="state">

	<div ng-switch-when="critical">
		<div ng-if="label">
			<label>{{label}} <span class="text-danger">*</span></label>
			<span ng-if="info" class="animate-if">
				<i class="fa fa-info-circle" gcms-popover></i>
				<div ng-hide="true" class="pop-content">{{info}}</div>
			</span>
		</div>
		<span class="popover-link" gcms-popover>
			<div class="input-group">
				<span class="btn btn-default pull-left" ng-if="value" role="button" ui-sref="recipient-detail-view({ id:value.id })" title="Recipient Details">
					<span ng-if="value.businessPartyTypeCode === 'HCP'"><i class="fa fa-user-md fa-2x"></i></span>
			    <span ng-if="value.businessPartyTypeCode === 'HCO'"><i class="fa fa-hospital-o fa-2x"></i></span>
				</span>
				<div class="well well-sm pull-left" style="width:450px">&nbsp;<gcms-name-label recipient="value"></gcms-name-label>
				</div>
				&nbsp;<span class="btn btn-default pull-left" role="button"><i class="fa fa-search fa-2x"></i></span>
			</div>
		</span>
		<div style="display:none" class="pop-content">
			<gcms-recipient-search source="source" criteria="criteria" result="setRecipient"></gcms-recipient-search>
		</div>
	</div>

	<div ng-switch-when="required">
		<div ng-if="label">
			<label>{{label}} <span class="text-danger">*</span></label>
			<span ng-if="info" class="animate-if">
				<i class="fa fa-info-circle" gcms-popover></i>
				<div ng-hide="true" class="pop-content">{{info}}</div>
			</span>
		</div>
		<span class="popover-link" gcms-popover>
			<div class="input-group">
				<span class="btn btn-default pull-left" ng-if="value" role="button" ui-sref="recipient-detail-view({ id:value.id })" title="Recipient Details">
					<span ng-if="value.businessPartyTypeCode === 'HCP'"><i class="fa fa-user-md fa-2x"></i></span>
			    <span ng-if="value.businessPartyTypeCode === 'HCO'"><i class="fa fa-hospital-o fa-2x"></i></span>
				</span>
				<div class="well well-sm pull-left" style="width:450px">&nbsp;<gcms-name-label recipient="value"></gcms-name-label>
				</div>
				&nbsp;<span class="btn btn-default pull-left" role="button"><i class="fa fa-search fa-2x"></i></span>
			</div>
		</span>
		<div style="display:none" class="pop-content">
			<gcms-recipient-search source="source" criteria="criteria" result="setRecipient"></gcms-recipient-search>
		</div>
	</div>

	<div ng-switch-when="optional">
		<div ng-if="label">
			<label>{{label}}</label>
			<span ng-if="info" class="animate-if">
				<i class="fa fa-info-circle" gcms-popover></i>
				<div ng-hide="true" class="pop-content">{{info}}</div>
			</span>
		</div>
		<span class="popover-link" gcms-popover>
			<div class="input-group">
				<span class="btn btn-default pull-left" ng-if="value" role="button" ui-sref="recipient-detail-view({ id:value.id })" title="Recipient Details">
					<span ng-if="value.businessPartyTypeCode === 'HCP'"><i class="fa fa-user-md fa-2x"></i></span>
			    <span ng-if="value.businessPartyTypeCode === 'HCO'"><i class="fa fa-hospital-o fa-2x"></i></span>
				</span>
				<div class="well well-sm pull-left" style="width:450px">&nbsp;<gcms-name-label recipient="value"></gcms-name-label>
				</div>
				&nbsp;<span class="btn btn-default pull-left" role="button"><i class="fa fa-search fa-2x"></i></span>
			</div>
		</span>
		<div style="display:none" class="pop-content">
			<gcms-recipient-search source="source" criteria="criteria" result="setRecipient"></gcms-recipient-search>
		</div>
	</div>

	<div ng-switch-when="view">
		<div>
			<div ng-if="label">
				<label>{{label}}</label>
				<span ng-if="info" class="animate-if">
					<i class="fa fa-info-circle" gcms-popover></i>
					<div ng-hide="true" class="pop-content">{{info}}</div>
				</span>
			</div>
  		<div>
				<span class="btn btn-default pull-left" ng-if="value" role="button" ui-sref="recipient-detail-view({ id:value.id })" title="Recipient Details">
					<span ng-if="value.businessPartyTypeCode === 'HCP'"><i class="fa fa-user-md fa-2x"></i></span>
			    <span ng-if="value.businessPartyTypeCode === 'HCO'"><i class="fa fa-hospital-o fa-2x"></i></span>
				</span>
				&nbsp;
  			</span><gcms-name-label recipient="value"></gcms-name-label>
  		</div>
		</div>
	</div>

</div>
* ```
*/

(function () {

  'use strict';

  angular
    .module('gcms.components.controls')
    .directive('gcmsSearch', Search);

    Search.$inject = ['state'];

    /**
     * @ngdoc method
     * @name Search
     * @methodOf gcms.components.controls.directive:gcmsSearch
     * @description Constructor for the Search directive
     * @param {object} state The service used to determine the mode of a control (critical, required, optional, view, hidden)
     * @returns {object} Search directive
     */
    function Search(state) {
      return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
  	      id: '@',
  	      label: '@',
  	      info: '@',
  		    attributeName: '@',
  	      value: '=model',
          source: '@',
          criteria: '=',
  	      form: '='
  	    },
        templateUrl: 'app/components/controls/search/components.search.html',
        link: function(scope, elem, attr, ngModel) {
          // ngModel is what has been set up by the ngModel directive.
          // wire up c to be the value of ngModel for this control
          scope.$watch('value', function(value) {
            ngModel.$setViewValue(value);
            ngModel.$validate();
          }, true);

          // set the name for ngModel and validation
          ngModel.$name = attr.name;
  	    },
        controller: function($scope) {
          // scopre variables
          $scope.source = $scope.source || 'components.search.html';

          /**
           * @ngdoc method
           * @name setRecipient
           * @methodOf gcms.components.controls.directive:gcmsSearch
           * @description Sets the $scope value property to the recipient
           * @param {object} recipient The recipient
           */
          $scope.setRecipient = function(recipient){
            $scope.value = recipient;
          };

          /**
           * @ngdoc method
           * @name setState
           * @methodOf gcms.components.controls.directive:gcmsSearch
           * @description Sets the state based on the country and attribute
           * @param {string} result The state (critical, required, etc.)
           */
          var setState = function(result) {
            $scope.state = result;
          };

          state.get($scope.attributeName).then(setState);

          /**
           * @ngdoc event
           * @name $localeChangeSuccess
           * @eventOf gcms.components.controls.directive:gcmsSearch
           * @eventType broadcast on root scope
           */
          $scope.$on('$localeChangeSuccess', function() {
            state.get($scope.attributeName).then(setState);
          });
        }
      };
    }
})();
