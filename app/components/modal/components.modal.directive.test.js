(function () {

  'use strict';

  describe('gcms.modal module', function() {

    var scope, element, q, modalInstance;

    beforeEach(module('gcms.components.modal'));
    beforeEach(module('templates'));

    beforeEach(function() {
      angular.mock.module(function($provide){
        $provide.factory('$modal', function() {
          return {
            open : function(item) {
              var deferred = q.defer();
              item.result = deferred.promise;
              return item;
            },
          };
        });
      });
    });

    beforeEach(inject(function($rootScope, $compile, $q) {
      scope = $rootScope.$new();
      q = $q;
      var emptyfunc = function() { /* do nothing */ };
      scope.ok = function(){ return emptyfunc; };
      scope.cancel = function(){ return emptyfunc; };
      var html = '<gcms-modal template="example.html" controller="ModalDefaultController" content="announcement" ok="delete" cancel="cancel"></gcms-modal>';
      element = angular.element(html);
      $compile(element)(scope);
      scope.$digest();

      spyOn(scope, 'ok');
      spyOn(scope, 'cancel');
    }));

    describe('after compiling', function() {
      it('Should register the open function', function() {
        expect(element.isolateScope().open).toBeFunction();
      });

      it('Should register the ok function', function() {
        expect(element.isolateScope().ok).toBeFunction();
      });

      it('Should register the cancel function', function() {
        expect(element.isolateScope().cancel).toBeFunction();
      });
    });

    describe('after clicking the button', function(){
      beforeEach(function(){
        modalInstance = element.isolateScope().open();
      });

      it('Should create a modal instance', function(){
        expect(modalInstance).toBeDefined();
      });

      it('Should member for the result promise for resolution of modal instance', function(){
        expect(modalInstance.result).toBeDefined();
      });

      it('Should set the correct template url', function(){
        expect(modalInstance.templateUrl).toBe('app/components/modal/templates/example.html');
      });
      it('Should set the correct controller', function(){
        expect(modalInstance.controller).toBe('ModalDefaultController');
      });
      it('Should create the promise to return', function(){
        expect(modalInstance.result.then).toBeDefined();
      });
      it('Should define the method to resolve modal', function(){
        expect(element.isolateScope().resolve).toBeDefined();
      });
      it('Should define the method to reject modal', function(){
        expect(element.isolateScope().reject).toBeDefined();
      });

      xit('Should call the ok function when a promise is satisfied', function(){
        element.isolateScope().resolve({});
        expect(scope.ok).toHaveBeenCalled();
      });

      it('Should call the cancel function when a promise is rejected');
    });

  });

})();
