(function() {

  'use strict';

  describe('gcms.administration', function() {

    var scope, UserProfile, $q, $rootScope, $controller, Role, UserDetail;

    var mockRole =
            [{
                'id': 1,
                'countryCode': null,
                'countryId': null,
                'createdDate': '2015-03-25',
                'updatedDate': null,
                'createdBy': 'Test',
                'updatedBy': null,
                'deleteRecord': false,
                'errors': null,
                'roleName': 'Guest',
                'roleDescription': 'Default (based on assignment of NT-ID) role, can only see Search HCP/O',
                'rolePermissions': [
                    {
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
                ]
            },
            {
                'id': 5,
                'countryCode': null,
                'countryId': null,
                'createdDate': '2014-01-01',
                'updatedDate': '2014-01-01',
                'createdBy': 'SINGHM62',
                'updatedBy': 'SINGHM62',
                'deleteRecord': false,
                'errors': null,
                'roleName': 'Local Admin',
                'roleDescription': 'Local Admin',
                'rolePermissions': [
                    {
                        'id': 162,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 1,
                        'roleActionName': 'Create',
                        'entityTypeName': 'Landing',
                        'entityTypeId': 1
                    },
                    {
                        'id': 163,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 2,
                        'roleActionName': 'Read',
                        'entityTypeName': 'Landing',
                        'entityTypeId': 1
                    },
                    {
                        'id': 164,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 3,
                        'roleActionName': 'Update',
                        'entityTypeName': 'Landing',
                        'entityTypeId': 1
                    },
                    {
                        'id': 165,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 4,
                        'roleActionName': 'Delete',
                        'entityTypeName': 'Landing',
                        'entityTypeId': 1
                    },
                    {
                        'id': 170,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 1,
                        'roleActionName': 'Create',
                        'entityTypeName': 'Covered Recipient',
                        'entityTypeId': 2
                    },
                    {
                        'id': 172,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 2,
                        'roleActionName': 'Read',
                        'entityTypeName': 'Covered Recipient',
                        'entityTypeId': 2
                    },
                    {
                        'id': 173,
                        'countryCode': null,
                        'countryId': null,
                        'createdDate': '2015-04-23',
                        'updatedDate': null,
                        'createdBy': 'talapr01',
                        'updatedBy': null,
                        'deleteRecord': false,
                        'errors': null,
                        'roleID': 5,
                        'roleActionId': 3,
                        'roleActionName': 'Update',
                        'entityTypeName': 'Covered Recipient',
                        'entityTypeId': 2
                    }
                ]
            }
        ];

    var mockUsers = [
      {
        'id': 1,
        'createdDate': '2015-04-20',
        'updatedDate': '2015-05-08',
        'createdBy': 'talapr01',
        'updatedBy': 'panigk',
        'countryCode': null,
        'countryId': 1768,
        'deleteRecord': false,
        'errors': null,
        'userName': 'andrej34',
        'firstName': 'Andres',
        'lastName': 'Joel ',
        'roles': null,
        'defaultProfileIndicator': true,
        'country': null,
        'roleId': 7,
        'deleted': false
    },
    {
        'id': 2,
        'createdDate': '2015-04-20',
        'updatedDate': '2015-05-04',
        'createdBy': 'talapr01',
        'updatedBy': 'talapr01',
        'countryCode': null,
        'countryId': 1768,
        'deleteRecord': false,
        'errors': null,
        'userName': 'talapr01',
        'firstName': 'Ramesh',
        'lastName': 'Talapaneni',
        'roles': null,
        'defaultProfileIndicator': false,
        'country': null,
        'roleId': 7,
        'deleted': false
    },
    {
        'id': 3,
        'createdDate': '2015-04-20',
        'updatedDate': null,
        'createdBy': 'talapr01',
        'updatedBy': null,
        'countryCode': null,
        'countryId': 1768,
        'deleteRecord': false,
        'errors': null,
        'userName': 'grekod',
        'firstName': 'Dmitry',
        'lastName': 'Grekov',
        'roles': null,
        'defaultProfileIndicator': false,
        'country': null,
        'roleId': 7,
        'deleted': false
    }
    ];
    var mockUsersCreate = {
       'id': 4,
       'createdDate': '2015-04-20',
       'updatedDate': '2015-05-07',
       'createdBy': 'talapr01',
       'updatedBy': 'narner',
       'countryCode': null,
       'countryId': 1768,
       'deleteRecord': false,
       'errors': null,
       'userName': 'narner',
       'firstName': 'Ramadevi',
       'lastName': 'Narne',
       'roles': null,
       'defaultProfileIndicator': false,
       'country': null,
       'roleId': 6,
       'deleted': false
    };

    var mockUsersDelete = [{
       'id': 5,
       'createdDate': '2015-04-20',
       'updatedDate': '2015-05-07',
       'createdBy': 'talapr01',
       'updatedBy': 'narner',
       'countryCode': null,
       'countryId': 1768,
       'deleteRecord': false,
       'errors': null,
       'userName': 'narner',
       'firstName': 'Ramadevi',
       'lastName': 'Narne',
       'roles': null,
       'defaultProfileIndicator': false,
       'country': null,
       'roleId': 6,
       'deleted': false
    }];

    beforeEach(module('gcms.administration'));
    beforeEach(module('templates'));

    beforeEach(module(function($provide) {
      $provide.factory('UserProfile', function() {
        return UserProfile;
      });
    }));

    beforeEach(module(function($provide) {
      $provide.factory('UserDetail', function() {
        return UserDetail;
      });
    }));

    beforeEach(module(function($provide) {
      $provide.factory('Role', function() {
        return Role;
      });
    }));

    beforeEach(module(function($provide) {
      $provide.value('$state', null);
    }));

    beforeEach(inject(function(_$q_, _$controller_, _$rootScope_) {
      $q = _$q_;
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $rootScope.session = sessionMock;
    }));

    var sessionMock = {
      user: {
          id: 1,
          token: 1,
          fullName: function(){ $q.when('Test User'); },
          getCurrentRole: function(){ return $q.when({}); },
          primaryRoleName: {},
          getCurrentProfile: function(){return $q.when({});},
          getAttributes: function(){return $q.when({});},
          getCurrentUser: function(){ return $q.when({}); },
          roles: function() { $q.when([]); },
          setRole: function() {}
      },
      collections: {
        country : {},
        role : {}
      }
    };

    beforeEach(function() {
      UserProfile = {
        query: function() {
          return {
            $promise: $q.when(mockUsers)
          };
        },
        create:function() {},
        update: function() {},
        delete: function() {}
      };

      Role = {
        query: function() {
          return {
            $promise: $q.when(mockRole)
          };
        },
      };

      UserDetail = {
        query: function() {
          return {
            $promise: $q.when(mockUsers)
          };
        },
      };
      spyOn(Role, 'query').and.callThrough();
      spyOn(UserDetail, 'query').and.callThrough();
      spyOn(UserProfile, 'query').and.callThrough();
      spyOn(UserProfile, 'delete').and.callThrough();
      spyOn(UserProfile, 'update').and.callThrough();
      spyOn(UserProfile, 'create').and.callThrough();
      scope = $rootScope.$new();
      $controller('AdminRoleCtrl', {$scope: scope});
      scope.$digest();
    });

    describe('Admin roles Controller', function() {

      it('Should call the Role query', function() {
        expect(Role.query).toHaveBeenCalled();
      });

      it('Should call the Role details', function() {
        expect(scope.roles).toEqual(mockRole);
      });

      it('Should call the UserProfile query', function() {
        expect(UserProfile.query).toHaveBeenCalled();
      });

      xit('Should retrieve the userroles data specific to the particular country', function() {
        expect(scope.profiles).toEqual(mockUsers);
      });

      it('Should contain three users', function() {
        expect(scope.profiles).toBeArrayOfSize(3);
      });

      xdescribe('When an new user role is created', function() {
        beforeEach(function() {
          scope.create(mockUsersCreate);
        });

        it('Should add one more user role details', function() {
          expect(scope.profiles).toBeArrayOfSize(4);
        });

        it('Should call the save function', function(){
          expect(UserProfile.save).toHaveBeenCalled();
        });
      });

      xdescribe('When an user role is deleted', function() {
        beforeEach(function() {
          expect(scope.profiles).toEqual(mockUsersDelete);
        });
        it('Should remove one user role details', function() {
          expect(scope.profiles).toBeArrayOfSize(2);
        });
      });
    });
  });
})();
