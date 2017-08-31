(function () {

  'use strict';

  xdescribe('gcms.components.controls', function() {

    var html, element, scope,
        $q, $rootScope, $compile, mockSession;

    var mockLov = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
      { id: 3, name: 'Test 3' },
      { id: 4, name: 'Test 4' }
    ];

    beforeEach(module('gcms.components.controls'));
    beforeEach(module('templates'));

    beforeEach(inject(function(_$q_, _$rootScope_, _$compile_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    }));

    beforeEach(function(){
      mockSession = {
        collections: {
          Test: function() { return $q.when(JSON.parse(JSON.stringify(mockLov))); }
        }
      };
    });

    xdescribe('lov directive', function(){

      beforeEach(function() {
        scope = $rootScope.$new();
        $rootScope.foo = 1;
        $rootScope.session = mockSession;
        html = '<gcms-lov label="test title" list="Test" value="foo"></gcms-lov>';
        element = $compile(html)(scope);
        scope.$digest();
      });

      describe('When the lov directive is called', function() {

        it('Should create the appropriate lov resource', function() {
          expect(element.isolateScope().lov()).toBeDefined();
        });

        it('Should select the appropriate lov resource', function() {
          expect(element.isolateScope().lov).toBe($rootScope.session.collections.Test);
        });

        it('Should retrieve and set the list of values', function(){
          expect(element.isolateScope().items).toBeArrayOfSize(5);
        });

        xit('Should append a blank vlaue to the top of the list', function(){
          expect(element.isolateScope().items[0].id).toBe('0');
          expect(element.isolateScope().items[0].name).toBe('');
        });

        xit('Should select the appropriate value in the list based on the passed in model', function(){
          expect(element.isolateScope().value.id).toBe(mockLov[0].id);
        });

      });

    });

    describe('lov directive', function(){

      beforeEach(function() {
        scope = $rootScope.$new();
        $rootScope.foo = 1;
        $rootScope.session = mockSession;
        html = '<gcms-lov label="test title" list="Test" value="foo"></gcms-lov>';
        element = $compile(html)(scope);
        scope.$digest();
      });

      describe('When the passed model has exception conditions', function(){
        describe('When the passed model is out of range', function(){
          beforeEach(function(){
            scope = $rootScope.$new();
            $rootScope.foo = 10;
            $rootScope.session = mockSession;
            element = $compile(html)(scope);
            scope.$digest();
          });
          xit('Should select the first empty entry', function() {
            expect(element.isolateScope().value.id).toBe('0');
          });
        });

        describe('When the passed model is a full object', function(){
          beforeEach(function(){
            scope = $rootScope.$new();
            $rootScope.foo = { id: 1, name: 'Test 1'};
            $rootScope.session = mockSession;
            element = $compile(html)(scope);
            scope.$digest();
          });
          it('Should select the first non-empty entry', function() {
            expect(element.isolateScope().value.id).toBe(1);
          });
        });

        describe('When the passed model is a partial object', function(){
          beforeEach(function(){
            scope = $rootScope.$new();
            $rootScope.foo = { id: 2, $$hashKey: '123' };
            $rootScope.session = mockSession;
            element = $compile(html)(scope);
            scope.$digest();
          });
          it('Should select the first non-empty entry', function() {
            expect(element.isolateScope().value.id).toBe(2);
          });
        });

        xdescribe('When the passed model is null', function(){
          beforeEach(function(){
            scope = $rootScope.$new();
            $rootScope.foo = null;
            $rootScope.session = mockSession;
            element = $compile(html)(scope);
            scope.$digest();
          });
          it('Should select the first empty entry', function() {
            expect(element.isolateScope().value.id).toBe('0');
          });
        });

        xdescribe('When the lov is misspelled', function(){
          beforeEach(function(){
            $rootScope.foo = null;
            $rootScope.session = mockSession;
            html = '<gcms-lov label="test title" list="Foo" value="foo"></gcms-lov>';
            element = $compile(html)(scope);
            scope.$digest();
          });
          xit('Should return an empty select', function() {
            expect(element.isolateScope().items).toBeArrayOfSize(0);
          });
        });

      });

    });
  });

})();
