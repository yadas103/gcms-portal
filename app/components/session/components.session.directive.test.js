(function () {

  'use strict';

  xdescribe('gcms.components.session', function() {

    var html, element, scope, $q, $rootScope, sessionMock;

    var mockUser = [
      {
        'id': null,
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
    // var mockUserProfile =   {
    //       'id': 8,
    //       'createdDate': '2015-04-20',
    //       'updatedDate': '2015-05-08',
    //       'createdBy': 'talapr01',
    //       'updatedBy': 'narner',
    //       'countryCode': null,
    //       'countryId': 1624,
    //       'deleteRecord': false,
    //       'errors': null,
    //       'userName': 'narner',
    //       'firstName': 'Ramadevi',
    //       'lastName': 'Narne',
    //       'roles': null,
    //       'defaultProfileIndicator': false,
    //       'country': null,
    //       'roleId': 7,
    //       'deleted': false
    //   };

    beforeEach(module('gcms.components.session'));
    beforeEach(module('templates'));

    beforeEach(inject(function(_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $rootScope.session = sessionMock;
    }));

    beforeEach(function(){
      sessionMock = {
        user: {
          id: 1,
          token: 1,
          fullName: $q.when('Test User'),
          getCurrentUser: $q.when(JSON.parse(JSON.stringify(mockUser))),
          getCurrentProfile: function() { $q.when({}); },
          // primaryRoleName: {},
          // getPermissions: {},
          // roles: $q.when([]),
          setProfile: function() { return null;}
        },
        collections: {
          country : {},
          role : {}
        }
      };
    });

    // beforeEach(module(function($provide){
    //   $provide.factory('UserProfile', function() {
    //     UserProfile = {
    //       query : function(){},
    //       get : function(){
    //         var deferred = $q.defer();
    //         deferred.resolve(JSON.parse(JSON.stringify(mockUserProfile)));
    //         return { $promise : deferred.promise };
    //       },
    //     };
    //     return UserProfile;
    //   });
    // }));

    beforeEach(inject(function(_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $rootScope.session = sessionMock;
    }));

    describe('user session directive', function(){

      beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();

        html = '<gcms-session></gcms-session>';
        element = $compile(html)(scope);

        scope.$digest();
      }));

      describe('when the session directive is called', function() {

        it('should define a setProfile', function() {
          expect(element.isolateScope().setProfile).toBeFunction();
        });

      });

    });
  });

})();
