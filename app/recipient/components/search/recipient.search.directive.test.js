(function () {

  'use strict';

  describe('gcms.recipient', function() {

    var $state;

    beforeEach(module('gcms.recipient'));
    beforeEach(module('templates'));

    beforeEach(module(function($provide){
      $provide.factory('$state', function() {
        $state = {
          go : function(){}
        };
        return $state;
      });
    }));

    beforeEach(function(){
      angular.module('gcms.recipient').directive('gcmsLov', function() {
        return {
            priority: 100000,
            terminal: true,
            link: function() {
            }
        };
      });
    });

    describe('Recipient search directive', function(){

      var $rootScope, $scope, $compile, $q, html, element;

      beforeEach(inject(function(_$q_, _$rootScope_, _$compile_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        html = '<gcms-recipient-search source="recipient.search.html"></gcms-recipient-search>';
        $scope = $rootScope.$new();

        element = $compile(html)($scope);

        $scope.$digest();
      }));

      describe('When the recipient search directive is called', function() {

        it('should define a request object', function() {
          expect(element.isolateScope().request).toBeDefined();
        });

      });

      describe('When the submit button is pressed', function() {

        beforeEach(function(){
          spyOn($state, 'go').and.callThrough();
        });

        it('should convert request object strings correctly', function() {
          var request = {'firstName': 'Fred'};
          element.isolateScope().submit(request);
          expect($state.go).toHaveBeenCalledWith('recipient-results', {criteria: '{"firstName":"Fred"}'});
        });

        it('should convert request object booleans correctly', function() {
          var request = {'isIncludeInactiveProfiles': true};
          element.isolateScope().submit(request);
          expect($state.go).toHaveBeenCalledWith('recipient-results', {criteria: '{"isIncludeInactiveProfiles":true}'});
        });

        it('should convert request object numbers correctly', function() {
          var request = {'businessPartyType': 1};
          element.isolateScope().submit(request);
          expect($state.go).toHaveBeenCalledWith('recipient-results', {criteria: '{"businessPartyType":1}'});
        });

        it('should not convert request object numbers equal to zero', function() {
          var request = {'businessPartyType': 0};
          element.isolateScope().submit(request);
          expect($state.go).toHaveBeenCalledWith('recipient-results', {criteria: '{}'});
        });

      });

    });

  });

})();
