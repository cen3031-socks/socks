'use strict';
var contactsApp = angular.module('contacts');

contactsApp.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

contactsApp.controller('ContactsHoursController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log', '$location', 'Dialogs', 'Volunteers',
    function($scope, $stateParams, Authentication, Contacts, $modal, $log, $location, Dialogs, Volunteers) {

    	$scope.makeName = function(firstname, surname) {
    		return firstname + ' ' + surname;
    	};

        $scope.find = function() {
            $scope.contacts = Contacts.query(function() {
        		var contacts = $scope.contacts; 
				var getMinutesWorked = function(contact) {
                    if (contact) {
                        var currDate = new Date();
                        var oldDate = new Date();
                        oldDate.setFullYear(2000);
                        var queryResult = Volunteers.minutesWorked({
                                startDate: +oldDate, 
                            	endDate: +currDate, 
                            	contactId: contact._id
                            }, 
                            function() {
                                contact.minutes_worked = queryResult.minutes;
                            });
                    }
			    };
                contacts.map(getMinutesWorked);
        	});
        };
        $scope.getDetails = function(contact) {
            $location.path('contacts/' + contact._id);
        };
        
    }
]);
