/**
 * @ngdoc service
 * @name gcms.components.session.service:session
 *
 * @description
 * This service provides session data to the application.
 *
 * ```js
 * function myCtrl($rootScope, $scope) {
 *   $scope.token = $rootScope.session.user.token;
 *   ...
 * }
 *```
 */

(function() {
  'use strict';

  angular
    .module('gcms.components.session')
    .factory('session', session);

	console.log('Here in user-detail***1....');
	
  session.$inject = ['$rootScope','$q', 'LoggedUserDetail', 'Country', 'Role', 'Lov', 'UIConfig', 'tmhDynamicLocale', 'localeMapper', 'CONFIG', 'Language', 'LocalText'];

  console.log('Here in user-detail***2....');
  /**
   * @ngdoc method
   * @name session
   * @methodOf gcms.components.session.service:session
   * @description Constructor for the session service
   * @param {object} $rootScope An execution context providing separation between the model and the view
   * @param {object} $q A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
   * @param {object} LoggedUserDetail Represents a logged user detail data service
   * @param {object} Country Represents a country data service
   * @param {object} Role Represents a role data service
   * @param {object} Lov Represents a lov data service
   * @param {object} UIConfig Represents a ui config data service
   * @param {object} tmhDynamicLocale The dynamic locale service that will be used to switch locales at runtime and to dynamically load in locale files
   * @param {object} localeMapper The locale mapper data service
   * @param {object} CONFIG The configuration constants for the application
   * @returns {object} The session service
   */
  function session($rootScope, $q, LoggedUserDetail, Country, Role, Lov, UIConfig, tmhDynamicLocale, localeMapper, CONFIG, Language, LocalText) {
	  
	  console.log('Here in user-detail***3....');
    // private variables
    var promises = {};
    var localizableLovs = {};
    var lovs = {};
    var userName = null;
    var userDetailPromise = null;
    var currentProfile = null;
    //var languages = null;
    //var currentLanguage = null;

    /**
     * @ngdoc method
     * @name resetLocalizableCache
     * @methodOf gcms.components.session.service:session
     * @description Resets all cached values that depend on county to null, used for locale changes
     */
    var resetLocalizableCache = function(){
      localizableLovs = {};
    };

    /**
     * @ngdoc method
     * @name getProfiles
     * @methodOf gcms.components.session.service:session
     * @description Gets profiles for a user (all countries)
     * @returns {object} A promise resolving to an array
     */
    var getCurrentUser = function () {
      console.log('Here in user-detail***getCurrentUser....1');
      console.log('Here in user-detail***getCurrentUser....' + userDetailPromise);
      if (!userDetailPromise) {
        console.log('Here in user-detail***getCurrentUser....2');
        userDetailPromise = LoggedUserDetail.query().$promise;
      }
      console.log('Here in user-detail***getCurrentUser....3');
      return userDetailPromise.then(function (result) {
        console.log('Here in user-detail***getCurrentUser....4');
        if (result) {
          // faild to get user details
          userName = result.userName;
        }
        userDetailPromise = null;

        return result;
      })
      .catch(function(error){
		  console.log('Here in user-detail***getCurrentUser....ERROR');
        // console.log('Current User ID Error', error);
        if(error.status === 0 && error.statusText === ''){
          window.location.assign('/');
          window.location.reload(true);
        }
      });
    };

    /**
     * @ngdoc method
     * @name getUserId
     * @methodOf gcms.components.session.service:session
     * @description Gets profile id for a user
     * @returns {object} A promise resolving to a number
     */
    var getUserId = function() {
		console.log('Here in user-detail***4....');
      return getCurrentUser().then(function(profile) {
        return profile.id;
      });
    };

    /**
     * @ngdoc method
     * @name getFullName
     * @methodOf gcms.components.session.service:session
     * @description Gets full name for a user
     * @returns {object} A promise resolving to a string
     */
    var getFullName = function() {
      return getCurrentUser().then(function(profile) {
        if(!profile) {
          return 'Anonymous User';
        }
        var firstName = profile.firstName || 'Unknown';
        var lastName = profile.lastName || 'Unknown';
        return firstName + ' ' + lastName;
      });
    };

    /**
     * @ngdoc method
     * @name getPrimaryProfile
     * @methodOf gcms.components.session.service:session
     * @description Gets primary profile for a user
     * @returns {object} A promise resolving to a profile object
     */
    var getPrimaryProfile = function() {
      return getCurrentUser().then(function(user){
		  console.log('Here in user-detail***UP5....'+user);
        var primaryProfile = null;
        if(localStorage.getItem("currentProfile") != null && localStorage.getItem("currentProfile") != undefined){
          angular.forEach(user.userProfiles, function(profile){
            if (profile.roleId === JSON.parse(localStorage.getItem("currentProfile")).roleId && profile.countryId == JSON.parse(localStorage.getItem("currentProfile")).countryId){
              primaryProfile = profile;
              console.log(primaryProfile)
            }
          }); 
        }
        else{
          angular.forEach(user.userProfiles, function(profile){
            if (profile.defaultProfileIndicator === true){
              primaryProfile = profile;
              console.log(primaryProfile)
            }
          }); 
        }
                
        return primaryProfile;
      });
    };

    /**
     * @ngdoc method
     * @name getCurrentProfile
     * @methodOf gcms.components.session.service:session
     * @description Gets current profile for a user
     * @returns {object} A promise resolving to a profile object
     */
    var getCurrentProfile = function() {
      console.log('Here in user-detail***UP1....');
      // console.log('Here in user-detail***UP2....'+currentProfile);
      if (currentProfile) {
        console.log("current profile..", JSON.stringify(currentProfile));
        return $q.when(currentProfile);

      }

      console.log('Here in user-detail***UP10....');
      // console.log('Here in user-detail***UP20....'+getPrimaryProfile());

      return getPrimaryProfile().then(function (profile) {
        console.log('Here in user-detail***UP3....' + JSON.stringify(profile));
        return profile;
      });
    };

    /**
     * @ngdoc method
     * @name setProfile
     * @methodOf gcms.components.session.service:session
     * @description Sets profile for a user
     * @param {Number} id The profile id for the profile to be set
     * @returns {object} A profile object
     */
    var setProfile = function(profile){
		console.log('Here in user-detail***UP4....'+JSON.stringify(profile));
		getAllLanguages(profile.countryId);

      setLocale(profile.countryId);
      resetLocalizableCache();
      $rootScope.currentProfile = profile;
      currentProfile = profile;
      if(currentProfile.roleId == 5){
        $rootScope.profileReviewTabShow = true;
        $rootScope.homeTabHide = true;
        $rootScope.notificationTabShow = false;
        $rootScope.preAdminTabShow = false;
        $rootScope.manageTabShow = true;
        $rootScope.adminTabShow = true;
      }
      else if(currentProfile.roleId == 6){
        $rootScope.profileReviewTabShow = false;
        $rootScope.manageTabShow = false;
        $rootScope.adminTabShow = false;
        $rootScope.homeTabHide = false;
        $rootScope.notificationTabShow = true;
        $rootScope.preAdminTabShow = true;
      }
      else if(currentProfile.roleId == 7){
        $rootScope.profileReviewTabShow = false;
        $rootScope.manageTabShow = false;
        $rootScope.adminTabShow = false;
        $rootScope.homeTabHide = false;
        $rootScope.notificationTabShow = true;
        $rootScope.preAdminTabShow = false;
      }
      return profile;
    };
    
    /**
     * @ngdoc method
     * @name getLocalText(language)
     * @methodOf gcms.components.session.service:session
     * @description Sets profile for a user
     * @param {Number} id The profile id for the profile to be set
     * @returns {object} A profile object
     */
  /*  var getLocalText = function(){
		console.log('Here in local-***UPL....');
      
      resetLocalizableCache();
      $rootScope.currentProfile = profile;
      currentProfile = profile;
      return profile;
    };*/

    /**
     * @ngdoc method
     * @name setLocale
     * @methodOf gcms.components.session.service:session
     * @description Sets locale
     * @param {Number} id The country id for the locale
     * @returns {object} A promise resolving to a locale object
     */
    var setLocale = function(countryId){
      return getCountry(countryId).then(function(country){
        var selectedLocale = CONFIG.locale.find(function(locale){
          return country.isoCode.toUpperCase() === locale.isoCode.toUpperCase();
        });
        if (!selectedLocale){
          selectedLocale = {
            isoCode: country.isoCode.toLowerCase(),
            locale: country.isoCode.toLowerCase()
          };
          CONFIG.locale.push(selectedLocale);
        }
        tmhDynamicLocale.set(selectedLocale.locale);
        localizableLovs = [];
        return selectedLocale;
      });
    };
    
    var getAllLanguages = function(countryId){
    	Language.query({id : countryId}).$promise.then(loadLanguages);
    };
    
    var loadLanguages = function(languages){
    	//console.log("curnt profile: "+JSON.stringify($rootScope.currentProfile));
    	$rootScope.currentProfile.languages = languages;
    	$rootScope.languages = languages;
    	//console.log("curnt profile: "+JSON.stringify($rootScope.currentProfile));
    	//var arr = languages.filter(d => d.default === 'Y');
    	var defaultLanguage = (languages.filter(d => d.default === 'Y'))[0];

    	$rootScope.currentProfile.defaultLanguage = defaultLanguage;
    	setLanguage(defaultLanguage);
		};

		var setLanguage = function(language){
			console.log('Here in setLanguage***SL1....' + language);
				
			resetLocalizableCache();
			$rootScope.currentProfile.currentLanguage = language;
			getLocalText($rootScope.currentProfile.countryId, $rootScope.currentProfile.currentLanguage.languageCode);
			return language;
	    };
	    
	    var getLocalText = function(countryId, languageCode){//console.log(countryId+languageCode);
	    	LocalText.query({id : countryId,language:languageCode}).$promise.then(loadLocalText);
	    };
	    
	    var loadLocalText = function(localData){
	    	$rootScope.translationData = localData;
	    };
			
    /**
     * @ngdoc method
     * @name getPermissions
     * @methodOf gcms.components.session.service:session
     * @description Gets permissions for the current profile
     * @returns {object} A promise resolving to a permissions array
     */
    var getPermissions = function() {
      return getCurrentProfile().then(function(profile){
        var profileRoleId = profile.roleId;
        return getRoles().then(function(roles){
          var permissions = null;
          angular.forEach(roles, function(role){
            if (role.id === profileRoleId){
              permissions = role.rolePermissions;
            }
          });
          return permissions;
        });
      });
    };

    /**
     * @ngdoc method
     * @name getAttributes
     * @methodOf gcms.components.session.service:session
     * @description Gets attributes for the specified country
     * @returns {object} A promise resolving to an attributes array
     */
    var getAttributes = function() {
      return getCountryAttributes();
    };

    /**
     * @ngdoc method
     * @name getCountry
     * @methodOf gcms.components.session.service:session
     * @description Gets country
     * @param {Number} id The id of a country
     * @returns {object} A promise resolving to a country object
     */
    var getCountry = function(id){
      return getCountries().then(function(countries) {
        var selectedCountry = null;
        angular.forEach(countries, function(country){
          if(country.id === id) {
            selectedCountry = country;
          }
        });
        return selectedCountry;
      });
    };

    /**
     * @ngdoc method
     * @name getCountries
     * @methodOf gcms.components.session.service:session
     * @description Gets countries
     * @returns {object} A promise resolving to a countries array
     */
    var getCountries = function() {
      if (lovs.countries) {
        return $q.when(lovs.countries);
      }

      if (!promises.country){
        promises.country = Country.query().$promise;        
      }

      return promises.country.then(function(result){
        promises.country = null;
        lovs.countries = result;
        $rootScope.countries = result;
        return result;
      });
    };

    /**
     * @ngdoc method
     * @name getRoles
     * @methodOf gcms.components.session.service:session
     * @description Gets roles
     * @returns {object} A promise resolving to a roles array
     */
    var getRoles = function() {
      if (lovs.roles) {
        return $q.when(lovs.roles);
      }

      if (!promises.roles){
        promises.roles = Role.query().$promise;
      }

      return promises.roles.then(function(result){
        promises.roles = null;
        lovs.roles = result;
        return result;
      });
    };

    /**
     * @ngdoc method
     * @name getLocalizedLov
     * @methodOf gcms.components.session.service:session
     * @description Gets lovs value
     * @returns {object} A promise resolving to a lovs array
     */
    var getLocalizedLov = function(lov) {
      if (localizableLovs[lov]) {
        return $q.when(localizableLovs[lov]);
      }

      if (!promises[lov]){
        promises[lov] = Lov.query({name: lov}).$promise;
      }

      return promises[lov].then(function(result){
        promises[lov] = null;
        localizableLovs[lov] = result;
        return result;
      });
    };

    /**
     * @ngdoc method
     * @name getUniqueIds
     * @methodOf gcms.components.session.service:session
     * @description Gets unique identifiers
     * @returns {object} A promise resolving to an unique identifiers array
     */
    var getUniqueIds = function() {
      return getLocalizedLov('unique-id');
    };

    /**
     * @ngdoc method
     * @name getCredentials
     * @methodOf gcms.components.session.service:session
     * @description Gets credentials
     * @returns {object} A promise resolving to a credentials array
     */
    var getCredentials = function() {
      return getLocalizedLov('credential');
    };

    /**
     * @ngdoc method
     * @name getSpecialties
     * @methodOf gcms.components.session.service:session
     * @description Gets specialties
     * @returns {object} A promise resolving to a specialties array
     */
    var getSpecialties = function() {
      return getLocalizedLov('specialty');
    };

    /**
     * @ngdoc method
     * @name getRecipientTypes
     * @methodOf gcms.components.session.service:session
     * @description Gets recipient types
     * @returns {object} A promise resolving to an recipient types array
     */
    var getRecipientTypes = function() {
      return $q.when(CONFIG.recipientType);
    };

    /**
     * @ngdoc method
     * @name getRecipientTypesString
     * @methodOf gcms.components.session.service:session
     * @description Gets recipient types
     * @returns {object} A promise resolving to an recipient types array with a string key
     */
    var getRecipientTypesString = function() {
      return $q.when(CONFIG.recipientTypeString);
    };

    /**
     * @ngdoc method
     * @name getCompletionStatuses
     * @methodOf gcms.components.session.service:session
     * @description Gets completion statuses
     * @returns {object} A promise resolving to a completion status array
     */
    var getCompletionStatuses = function() {
      return $q.when(CONFIG.completionStatus);
    };

    /**
     * @ngdoc method
     * @name getLockedStatuses
     * @methodOf gcms.components.session.service:session
     * @description Gets locked statuses
     * @returns {object} A promise resolving to a locked status array
     */
    var getLockedStatuses = function() {
      return $q.when(CONFIG.lockedStatus);
    };

    /**
     * @ngdoc method
     * @name getAddressTypes
     * @methodOf gcms.components.session.service:session
     * @description Gets address types
     * @returns {object} A promise resolving to an address types array
     */
    var getAddressTypes = function() {
      return getLocalizedLov('address-type');
    };

    /**
     * @ngdoc method
     * @name getConsentTypes
     * @methodOf gcms.components.session.service:session
     * @description Gets consent types
     * @returns {object} A promise resolving to a consent types array
     */
    var getConsentTypes = function() {
      return getLocalizedLov('consent');
    };
   

    /**
     * @ngdoc method
     * @name getSuffixes
     * @methodOf gcms.components.session.service:session
     * @description Gets suffixes
     * @returns {object} A promise resolving to a suffixes array
     */
    var getSuffixes = function() {
      return $q.when(CONFIG.suffix);
    };

    /**exchangeSource
     * @ngdoc method
     * @name getTransactionStatuses
     * @methodOf gcms.components.session.service:session
     * @description Gets transaction statuses
     * @returns {object} A promise resolving to a transaction statuses array
     */
    var getTransactionStatuses = function() {
       return $q.when(CONFIG.transactionStatus);
    };

    /**
    * @ngdoc method
    * @name getPayeeTypes
    * @methodOf gcms.components.session.service:session
    * @description Gets payee types
    * @returns {object} A promise resolving to a payee types array
    */
    var getPayeeTypes = function() {
      return getLocalizedLov('payee-type');
    };

    /**
    * @ngdoc method
    * @name getSourceCode
    * @methodOf gcms.components.session.service:session
    * @description Gets source codes
    * @returns {object} A promise resolving to a source codes array
    */
    var getSourceCode = function() {
      return getLocalizedLov('source-code');
    };

    /**
    * @ngdoc method
    * @name getNameTypes
    * @methodOf gcms.components.session.service:session
    * @description Gets name types
    * @returns {object} A promise resolving to a name types array
    */
    var getNameTypes = function() {
      return getLocalizedLov('name-type');
    };

    /**
    * @ngdoc method
    * @name getFileTypes
    * @methodOf gcms.components.session.service:session
    * @description Gets file types
    * @returns {object} A promise resolving to a file types array
    */
    var getFileTypes = function() {
      return getLocalizedLov('file-type');
    };

    /**
    * @ngdoc method
    * @name getLocales
    * @methodOf gcms.components.session.service:session
    * @description Gets locales
    * @returns {object} A promise resolving to a locales array
    */
    var getLocales = function() {
      return $q.when(CONFIG.locale);
    };

    /**
    * @ngdoc method
    * @name getCountryAttributes
    * @methodOf gcms.components.session.service:session
    * @description Gets country attributes
    * @returns {object} A promise resolving to a country attribute array
    */
    var getCountryAttributes = function() {
      return getLocalizedLov('country-attribute');
    };

    /**
    * @ngdoc method
    * @name getLegalEntities
    * @methodOf gcms.components.session.service:session
    * @description Gets Legal entities
    * @returns {object} A promise resolving to a legal entities array
    */
    var getLegalEntity = function() {
      return getLocalizedLov('legal-entity');
    };

    /**
     * @ngdoc method
     * @name getCoveredRecipientRole
     * @methodOf gcms.components.session.service:session
     * @description Gets Covered RecipientRoles
     * @returns {object} A promise resolving to a covered recipeint role array
     */
     var getCoveredRecipientRole = function() {
       return getLocalizedLov('covered-recipient-role');
     };
    
    /**
    * @ngdoc method
    * @name getFomattedLegalEntityTypes
    * @methodOf gcms.components.session.service:session
    * @description Gets formatted Legal Entity types
    * @returns {object} A promise resolving to an formatted Legal Entity types array
    */
    var getFomattedLegalEntityTypes = function() {
      return getLocalizedLov('legal-entity')
      .then(function(legalEntityTypes){
        return $q.all([legalEntityTypes, getCountries()]);
      })
      .then(function(result){
        var legalEntityTypes = result[0];
        var countries = result[1];
        var isoCode = localeMapper.getCurrentISOCode();
        var country = countries.find(function(item){ return item.isoCode.toUpperCase() === isoCode.toUpperCase(); });
        var countryName = country ? country.name : '';
        var formattedValues = legalEntityTypes.map(function(item){
          var obj = {};
          if (item.value && item.name){
            obj.id = item.id;
            obj.name = countryName + ' - ' + item.value + ' - ' + item.name;
            obj.value = countryName + ' - ' + item.value + ' - ' + item.name;
          }
          return obj;
        });
        return $q.when(formattedValues);
      });
    };

    return {
      set: function() {
        return {
          user: {
            userId: getUserId,
            userName: userName,
            fullName: getFullName(),
            getCurrentUser: getCurrentUser(),
            getCurrentProfile: getCurrentProfile,
            primaryProfile: getPrimaryProfile(),
            getPermissions: getPermissions,
            getAttributes: getAttributes,
            setProfile: setProfile
          },
          collections: {
            addressType: getAddressTypes,
            recipientType: getRecipientTypes,
            recipientTypeString: getRecipientTypesString,
            completionStatus: getCompletionStatuses,
            lockedStatus: getLockedStatuses,
            consentType: getConsentTypes,
            suffix: getSuffixes,
            transactionStatus: getTransactionStatuses,
            sourceCode: getSourceCode,
            uniqueid: getUniqueIds,
            credential: getCredentials,
            specialty: getSpecialties,
            country : getCountries,
            role : getRoles,
            payeeType: getPayeeTypes,
            nameType: getNameTypes,
            fileType: getFileTypes,
            locale: getLocales,
            countryAttributes: getCountryAttributes,
            legalEntity : getLegalEntity,
            coveredRecipientRole : getCoveredRecipientRole
          }
        };
      }
    };

  }

})();
