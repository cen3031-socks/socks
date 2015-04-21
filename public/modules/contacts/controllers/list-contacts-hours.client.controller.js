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
})

contactsApp.controller('ContactsHoursController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log', '$location', 'Dialogs', 'Volunteers',
    function($scope, $stateParams, Authentication, Contacts, $modal, $log, $location, Dialogs, Volunteers) {

    	$scope.makeName = function(firstname, surname) {
    		return firstname + ' ' + surname;
    	};

        $scope.find = function() {
            $scope.contacts = Contacts.query(function() {
        		var contacts = $scope.contacts; 
        		for (var idx = 0; idx < contacts.length; ++idx) {
        			(function(i) { 
        				console.log(contacts[i]);
	        			if (contacts[i]) {
	        				var currDate = new Date();
					        var oldDate = new Date();
					        oldDate.setFullYear(2000);
					        //If statement should call minutes worked from volunteers.server.controller.js
					        var minutes_worked = Volunteers.minutesWorked(
					        	{
					        		startDate: +oldDate, 
					        		endDate: +currDate, 
					        		contactId: contacts[i]._id
					        	}, 
					        	function() {
						            contacts[i].minutes_worked = minutes_worked.minutes;
						        });
		        		}
		        	}(idx));
        		}
        	});
        };
        $scope.getDetails = function(contact) {
            $location.path('contacts/' + contact._id);
        };
        
    }
]);
