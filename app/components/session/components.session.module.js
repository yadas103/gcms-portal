/**
 * @ngdoc overview
 * @name gcms.components.session
 *
 * @requires gcms.components.data
 *
 * @description
 * Represents a session module.
 */

(function () {

  'use strict';

  angular
    .module('gcms.components.session', [
      'gcms.components.data'
    ]);

}());

/**
 * @ngdoc overview
 * @name gcms.components.session
 *
 * @requires gcms.components.data
 *
 * @description
 * Represents a session module.
 */

/*(function () {

  'use strict';

  angular
    .module('gcms.components.session', [
      'gcms.components.data'
    ]).filter("gTranslate", function ($rootScope) {

        function translateFilter(input, value) {

        	
        	var translation = '';
            var langData = $rootScope.currentProfile.localData;
            if (langData) {
                langData.filter(function (langObject) {
                    if (langObject.attributeName === value) {
                        translation = langObject.localText;
                    }
                });
            }
            
            return value ;
        };

        return translateFilter;
    });

}());


*/


(function() {
	"use strict";

	angular.module("gcms").filter("gTranslate", function() {
		
		function translateText(defaultText, data, attrib) {
			
			var translation = '';
			var langData = data;
			if (langData) {
				// filter the local text and retrieve the record matching the given attribute
				langData.filter(function(langObject) {
					if (langObject.attributeName == attrib) {
						translation = langObject.localText;
					}
				});
			}

			// if translation not present, return original text
			if (translation == '') {
				translation = defaultText;
			}
			return translation;
		}
		

		return translateText;
	});
})();