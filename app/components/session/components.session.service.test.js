(function () {

  'use strict';

  xdescribe('gcms.components.session', function() {

    var $q, $rootScope, $scope, session, testSession,
      User, Country, Role, Specialty, Credential, UniqueId, CONFIG, LoggedUserDetail, localeMapper, Lov, UIConfig;

    var mockCONFIG = {
      type: [
        {'id': 1, 'name': 'type1'},
        {'id': 2, 'name': 'type2'}
      ],
      suffix: [
        {'id': 1, 'name': 'suffix1'},
        {'id': 2, 'name': 'suffix2'}
      ]
    };

    var mockUser = [
      {
        'id': 1,
        'createdDate': '2015-04-20',
        'updatedDate': '2015-05-07',
        'createdBy': 'talapr01',
        'updatedBy': 'narner',
        'countryCode': null,
        'countryId': null,
        'deleteRecord': null,
        'errors': null,
        'userName': 'narner',
        'firstName': 'Ramadevi',
        'lastName': 'Narne',
        'middleName': null,
        'suffix': 'Mrs               ',
        'userProfiles': [
            {
                'id': 8,
                'createdDate': '2015-04-20',
                'updatedDate': '2015-05-08',
                'createdBy': 'talapr01',
                'updatedBy': 'narner',
                'countryCode': null,
                'countryId': 1624,
                'deleteRecord': false,
                'errors': null,
                'userName': 'narner',
                'firstName': 'Ramadevi',
                'lastName': 'Narne',
                'roles': null,
                'defaultProfileIndicator': false,
                'country': null,
                'roleId': 7,
                'deleted': false
            }]
          }

    ];

    var mockCountries = [
      {
        'id': 1,
        'countryCode': 'en-gb',
        'countryName': 'United Kingdom',
        'businessRules': []
      },
      {
        'id': 2,
        'countryCode': 'de',
        'countryName': 'Germany',
        'businessRules': []
      },
      {
        'id': 3,
        'countryCode': 'en-us',
        'countryName': 'United States',
        'businessRules': []
      },
      {
        'id': 4,
        'countryCode': 'ja',
        'countryName': 'Japan',
        'businessRules': []
      },
      {
        'id': 5,
        'countryCode': 'fr',
        'countryName': 'France',
        'businessRules': []
      }
    ];

    var mockRoles =
      {
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
            }]
          };


    var mockSpecialties = [
      {'id': 1, 'name': 'Anesthesiology'},
      {'id': 2, 'name': 'Dermatology'}
    ];

    var mockUniqueIds = [
      [
        { 'id': 1, 'name': 'Cegedim OneKey'},
        { 'id': 2, 'name': 'TR ID'},
        { 'id': 3, 'name': 'Longlife ID'},
        { 'id': 4, 'name': 'TIN'},
        { 'id': 5, 'name': 'SAP Vendor ID'},
        { 'id': 6, 'name': 'Fiscal ID'},
        { 'id': 7, 'name': 'Oracle Vendor ID'},
        { 'id': 8, 'name': 'SUN Vendor ID'}
      ]
    ];

    var mockCredentials = [
      { 'id': 1, 'name': 'MD' }
    ];

    var mockUserDetail =   {
          'id': 8,
          'createdDate': '2015-04-20',
          'updatedDate': '2015-05-08',
          'createdBy': 'talapr01',
          'updatedBy': 'narner',
          'countryCode': null,
          'countryId': 1624,
          'deleteRecord': false,
          'errors': null,
          'userName': 'narner',
          'firstName': 'Ramadevi',
          'lastName': 'Narne',
          'roles': null,
          'defaultProfileIndicator': false,
          'country': null,
          'roleId': 7,
          'deleted': false
      };

      var mockLov =
        {
          'id': 1033,
          'createdDate': '2015-04-19',
          'updatedDate': '2015-04-19',
          'createdBy': 'INFORMATICA',
          'updatedBy': 'INFORMATICA',
          'name': 'ADDITIONAL ADDRESS 1',
          'value': 'ADDITIONAL ADDRESS 1',
          'deleted': false,
          'addressTypeCode': null,
          'addressTypeDescription': null
      };

      var mockUIConfig =
      {
          'id': null,
          'createdDate': null,
          'updatedDate': null,
          'createdBy': null,
          'updatedBy': null,
          'bobjURL': 'http://bi4dev.pfizer.com'
      };


    beforeEach(module('gcms.components.session'));

    beforeEach(module(function($provide){
      $provide.factory('CONFIG', function() {
        CONFIG = {
          query : function(){},
          get : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockCONFIG))) };
          },
          update : function(){},
          save : function(){},
          delete : function(){}
        };
        return CONFIG;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('User', function() {
        User = {
          query : function(){},
          get : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockUser))) };
          },
          update : function(){},
          save : function(){},
          delete : function(){},
          setRole : function(){}
        };
        return User;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('Country', function() {
        Country = {
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockCountries))) };
          },
          get : function(){},
          update : function(){},
          save : function(){},
          delete : function(){}
        };
        return Country;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('UniqueId', function() {
        UniqueId = {
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockUniqueIds))) };
          },
          get : function(){},
          update : function(){},
          save : function(){},
          delete : function(){}
        };
        return UniqueId;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('Specialty', function() {
        Specialty = {
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockSpecialties))) };
          },
          get : function(){},
          update : function(){},
          save : function(){},
          delete : function(){}
        };
        return Specialty;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('Credential', function() {
        Credential = {
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockCredentials))) };
          },
          get : function(){},
          update : function(){},
          save : function(){},
          delete : function(){}
        };
        return Credential;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('Role', function() {
        Role = {
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockRoles))) };
          },
          get : function(){},
          update : function(){},
          save : function(){},
          delete : function(){}
        };
        return Role;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('tmhDynamicLocale', function() {
        return {
          set : function(){}
        };
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('Lov', function() {
        Lov = {
          get : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockLov))) };
          }
        };
        return Lov;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('UIConfig', function() {
        UIConfig = {
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockUIConfig))) };
          }
        };
        return UIConfig;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('LoggedUserDetail', function() {
        LoggedUserDetail = {
          get : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockUserDetail))) };
          },
          query : function(){
            return { $promise : $q.when(JSON.parse(JSON.stringify(mockUIConfig))) };
          }
        };
        return LoggedUserDetail;
      });
    }));

    beforeEach(module(function($provide){
      $provide.factory('localeMapper', function() {
        localeMapper = {
          getCurrentISOCode : function(){}
        };
        return localeMapper;
      });
    }));

    beforeEach(inject(function(_$q_, _$rootScope_, _session_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      session = _session_;
    }));

    describe('user session service', function(){

      beforeEach(inject(function() {
        testSession = session.set();
      }));

      describe('when the session service is called', function() {

        it('should return the correct user id', function() {
          //console.log('testSession', testSession.user );
          expect(testSession.user.id).toBe(1);
        });

        xit('should return the correct full name', function(done) {
          testSession.user.fullName.then(function(result){
            expect(result).toBe('Test User');
          }).catch(function(error) {
            //console.log(error);
          }).finally(function(){
            done();
          });
          $scope.$apply();
        });

        it('should return the correct current role', function(done) {
          testSession.user.getCurrentRole().then(function(role){
            expect(role.roleName).toBe('Super Admin');
          }).catch(function(error) {
            //console.log(error);
          }).finally(function(){
            done();
          });
          $scope.$apply();
        });

        it('should return the correct primary role', function(done) {
          testSession.user.primaryRole.then(function(role){
            expect(role.roleName).toBe('Super Admin');
          }).catch(function(error) {
            //console.log(error);
          }).finally(function(){
            done();
          });
          $scope.$apply();
        });

        it('should return the correct permissions', function(done) {
          testSession.user.getPermissions().then(function(permissions){
            expect(permissions[0].create).toBe(true);
          }).catch(function(error) {
            //console.log(error);
          }).finally(function(){
            done();
          });
          $scope.$apply();
        });

        it('should return the correct roles', function(done) {
          testSession.user.roles.then(function(roles){
            expect(roles[0].roleName).toBe('Super Admin');
          }).catch(function(error) {
            //console.log(error);
          }).finally(function(){
            done();
          });
          $scope.$apply();
        });

        it('should set a role correctly', function(done) {
          testSession.user.setRole(1).then(function(role){
            expect(role.countryId).toBe(2);
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
