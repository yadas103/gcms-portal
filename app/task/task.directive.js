/**
 * @ngdoc overview
 * @name gcms.task
 *
 * @description
 * Represents a task module directive and filter.
 */

(function () {

  'use strict';

  angular
    .module('gcms.task')
    .directive('stSelectDistinct', [function() {
        return {
            restrict: 'E',
            require: '^stTable',
            scope: {
              collection: '=',
              predicate: '@',
              predicateExpression: '='
            },
            template: '<select ng-model="selectedOption" ng-change="optionChanged(selectedOption)" ng-options="opt for opt in distinctItems"></select>',
            link: function(scope, element, attr, table) {
              var getPredicate = function() {
                var predicate = scope.predicate;
                if (!predicate && scope.predicateExpression) {
                  predicate = scope.predicateExpression;
                }
                return predicate;
              }

              scope.$watch('collection', function(newValue) {
                var predicate = getPredicate();

                if (newValue) {
                  var temp = [];
                  scope.distinctItems = ['All'];

                  angular.forEach(scope.collection, function(item) {
                    var value = item[predicate];

                    if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
                      temp.push(value);
                    }
                  });
                  temp.sort();

                  scope.distinctItems = scope.distinctItems.concat(temp);
                  scope.selectedOption = scope.distinctItems[0];
                  scope.optionChanged(scope.selectedOption);
                }
              }, true);

              scope.optionChanged = function(selectedOption) {
                var predicate = getPredicate();

                var query = {};

                query.distinct = selectedOption;

                if (query.distinct === 'All') {
                  query.distinct = '';
                }

                table.search(query, predicate);
              };
            }
          }
        }])
       .directive('pageSelect', [function() {
    	   return {
    		restrict: 'E',
    		
        	template: '<input type="number" class="select-page" ng-model="inputPage" min=1  max={{numPages}} ng-change="selectPage(inputPage)" required></input>',
        	link: function(scope, element, attrs) {
        		
        	scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          	});
        	}
    	   }
       }])
        .filter('customFilter', ['$filter', function($filter) {
        var filterFilter = $filter('filter');
        var standardComparator = function standardComparator(obj, text) {
          text = ('' + text).toLowerCase();
          return ('' + obj).toLowerCase().indexOf(text) > -1;
        };

        return function customFilter(array, expression) {
          function customComparator(actual, expected) {

            var isBeforeActivated = expected.before;
            var isAfterActivated = expected.after;
            var isLower = expected.lower;
            var isHigher = expected.higher;
            var higherLimit;
            var lowerLimit;
            var itemDate;
            var queryDate;

            if (angular.isObject(expected)) {
              //exact match
              if (expected.distinct) {
                if (!actual || actual.toLowerCase() !== expected.distinct.toLowerCase()) {
                  return false;
                }

                return true;
              }

              //matchAny
              if (expected.matchAny) {
                if (expected.matchAny.all) {
                  return true;
                }

                if (!actual) {
                  return false;
                }

                for (var i = 0; i < expected.matchAny.items.length; i++) {
                  if (actual.toLowerCase() === expected.matchAny.items[i].toLowerCase()) {
                    return true;
                  }
                }

                return false;
              }

              //date range
              if (expected.before || expected.after) {
                try {
                  if (isBeforeActivated) {
                    higherLimit = expected.before;

                    itemDate = new Date(actual);
                    queryDate = new Date(higherLimit);

                    if (itemDate > queryDate) {
                      return false;
                    }
                  }

                  if (isAfterActivated) {
                    lowerLimit = expected.after;


                    itemDate = new Date(actual);
                    queryDate = new Date(lowerLimit);

                    if (itemDate < queryDate) {
                      return false;
                    }
                  }

                  return true;
                } catch (e) {
                  return false;
                }

              } else if (isLower || isHigher) {
                //number range
                if (isLower) {
                  higherLimit = expected.lower;

                  if (actual > higherLimit) {
                    return false;
                  }
                }

                if (isHigher) {
                  lowerLimit = expected.higher;
                  if (actual < lowerLimit) {
                    return false;
                  }
                }

                return true;
              }
              //etc

              return true;

            }
            return standardComparator(actual, expected);
          }

          var output = filterFilter(array, expression, customComparator);
          return output;
        };
      }]);
}());
