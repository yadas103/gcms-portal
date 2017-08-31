(function() {

  'use strict';

  describe('gcms.administration', function() {

    var scope, UserResource, Role, $q, $rootScope, $controller, UserDetail;

    var mockUser = [
       {
            'id': 1041,
            'createdDate': '2015-05-05',
            'updatedDate': null,
            'createdBy': 'panigk',
            'updatedBy': null,
            'countryCode': null,
            'countryId': 1768,
            'deleteRecord': false,
            'errors': null,
            'userName': 'rayudp01',
            'firstName': 'Pushpa',
            'lastName': 'Rayudu',
            'roles': null,
            'defaultProfileIndicator': false,
            'country': null,
            'roleId': 5,
            'deleted': false
        },
        {
            'id': 1055,
            'createdDate': '2015-05-08',
            'updatedDate': '2015-05-08',
            'createdBy': 'narner',
            'updatedBy': 'narner',
            'countryCode': null,
            'countryId': 1768,
            'deleteRecord': false,
            'errors': null,
            'userName': 'MAROJS',
            'firstName': 'Siiva',
            'lastName': 'Maroju',
            'roles': null,
            'defaultProfileIndicator': true,
            'country': null,
            'roleId': 7,
            'deleted': false
        },
        {
            'id': 1061,
            'createdDate': '2015-05-08',
            'updatedDate': '2015-05-11',
            'createdBy': 'panigk',
            'updatedBy': 'panigk',
            'countryCode': null,
            'countryId': 1768,
            'deleteRecord': false,
            'errors': null,
            'userName': 'EDLABR',
            'firstName': 'Rohan',
            'lastName': 'edlabakar',
            'roles': null,
            'defaultProfileIndicator': true,
            'country': null,
            'roleId': 3,
            'deleted': false
        }
    ];

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

    beforeEach(module('gcms.administration'));
    beforeEach(module('templates'));

    beforeEach(module(function($provide) {
      $provide.factory('User', function() {
        return UserResource;
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
      $provide.value('$stateParams', {
        id: 1
      });
    }));

    beforeEach(module(function($provide) {
      $provide.value('$state', null);
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
          // roles: function() { $q.when([]); },
          // setRole: function() {}
      },
      collections: {
        country : {},
        role : function() { $q.when([]); }
      }
    };


    beforeEach(inject(function(_$q_, _$rootScope_, _$controller_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $rootScope.session = sessionMock;
    }));

    beforeEach(function() {
      UserResource = {
        get: function() {
          return {
            $promise: $q.when(mockUser)
          };
        }
      };
      Role = {
        query: function() {
          return {
            $promise: $q.when(mockRole)
          };
        },
        get: function(){}
      };
      UserDetail = {
        get: function() {
          return {
            $promise: $q.when(mockUser)
          };
        },
        update: function() {}
      };
      spyOn(UserDetail, 'get').and.callThrough();
      spyOn(UserResource, 'get').and.callThrough();
      spyOn(Role, 'query').and.callThrough();
      spyOn(Role, 'get').and.callThrough();
      scope = $rootScope.$new();
      $controller('UserRoleCtrl', {$scope: scope});
      scope.$digest();
    });

    xdescribe('UserRole Controller', function() {
      it('The user has a same data as mockUser', function() {
        expect(scope.user).toBe(mockUser);
      });
      xit('Should get the user data', function() {
        expect(UserResource.get).toHaveBeenCalled();
      });
      xit('Should query the userrole data', function() {
        expect(Role.query).toHaveBeenCalled();
      });
    });
  });
})();
