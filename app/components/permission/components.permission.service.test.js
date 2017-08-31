(function () {

  'use strict';

  describe('gcms.components.permission module', function() {

    var $q, $rootScope, $scope, permission;

    var sessionMock = {
      user: {
        id: 1,
        token: 1,
        fullName: function(){ $q.when('Test User'); },
        getCurrentRole: function(){ return $q.when({}); },
        primaryRoleName: {},
        getPermissions: function() {
          return $q.when(
            [{
                  'id': 100,
                  'countryCode': null,
                  'countryId': null,
                  'createdDate': '2020-04-08',
                  'updatedDate': null,
                  'createdBy': 'talapr01',
                  'updatedBy': null,
                  'deleteRecord': false,
                  'errors': null,
                  'roleID': 1,
                  'roleActionId': 2,
                  'roleActionName': 'Read',
                  'entityTypeName': 'Landing',
                  'entityTypeId': 1
              },
              {
                  'id': 101,
                  'countryCode': null,
                  'countryId': null,
                  'createdDate': '2020-04-08',
                  'updatedDate': null,
                  'createdBy': 'talapr01',
                  'updatedBy': null,
                  'deleteRecord': false,
                  'errors': null,
                  'roleID': 1,
                  'roleActionId': 2,
                  'roleActionName': 'Read',
                  'entityTypeName': 'Covered Recipient',
                  'entityTypeId': 2
              },
              {
                  'id': 102,
                  'countryCode': null,
                  'countryId': null,
                  'createdDate': '2020-04-08',
                  'updatedDate': null,
                  'createdBy': 'talapr01',
                  'updatedBy': null,
                  'deleteRecord': false,
                  'errors': null,
                  'roleID': 1,
                  'roleActionId': 2,
                  'roleActionName': 'Read',
                  'entityTypeName': 'Value Exchange',
                  'entityTypeId': 3
              },
              {
                  'id': 103,
                  'countryCode': null,
                  'countryId': null,
                  'createdDate': '2020-04-08',
                  'updatedDate': null,
                  'createdBy': 'talapr01',
                  'updatedBy': null,
                  'deleteRecord': false,
                  'errors': null,
                  'roleID': 1,
                  'roleActionId': 2,
                  'roleActionName': 'Read',
                  'entityTypeName': 'Administration',
                  'entityTypeId': 4
              }

              // {'entityTypeName':'Landing', 'roleName': 'Guest', 'create': false, 'read': true, 'update': false, 'delete': false },
              // {'entityTypeName':'Coverd Recipient', 'roleName': 'Guest', 'create': false, 'read': true, 'update': false, 'delete': false },
              // {'entityTypeName':'Value Exchange', 'roleName': 'Guest', 'create': false, 'read': true, 'update': false, 'delete': false },
              // {'entityTypeName':'Administration', 'roleName': 'Guest', 'create': false, 'read': true, 'update': false, 'delete': false },
            ]
          );
        },
        roles: function() { $q.when([]); },
        setRole: function() {}
      },
      collections: {
        country : {},
        role : {}
      }
    };

    beforeEach(module('gcms.components.permission'));

    beforeEach(inject(function(_$q_, _$rootScope_, _permission_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      permission = _permission_;
    }));

    describe('user permission service', function(){

       beforeEach(inject(function($rootScope) {
         $scope = $rootScope.$new();
         $rootScope.session = sessionMock;
      }));

       describe('when the permission service is called', function() {

         it('should return correct create permission', function(done) {
            permission.get('Landing', 'create').then(function(permission){
              expect(permission).toBe(false);
            }).catch(function(error) {
              //console.log(error);
            }).finally(function(){
              done();
            });
            $scope.$apply();
         });

         it('should return correct read permission', function(done) {
            permission.get('Landing', 'read').then(function(permission){
              expect(permission).toBe(true);
            }).catch(function(error) {
              //console.log(error);
            }).finally(function(){
              done();
            });
            $scope.$apply();
         });

         it('should return correct update permission', function(done) {
            permission.get('Landing', 'update').then(function(permission){
              expect(permission).toBe(false);
            }).catch(function(error) {
              //console.log(error);
            }).finally(function(){
              done();
            });
            $scope.$apply();
         });

         it('should return correct delete permission', function(done) {
            permission.get('Landing', 'delete').then(function(permission){
              expect(permission).toBe(false);
            }).catch(function(error) {
              //console.log(error);
            }).finally(function(){
              done();
            });
            $scope.$apply();
         });

       });

    });

  });

})();
