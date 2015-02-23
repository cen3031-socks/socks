'use strict';

//Setting up route
angular.module('volunteers').config(['$stateProvider',
	function($stateProvider) {
		// Volunteers state routing
		$stateProvider.
		state('listVolunteers', {
			url: '/volunteers',
			templateUrl: 'modules/volunteers/views/list-volunteers.client.view.html'
		}).
		state('createVolunteer', {
			url: '/volunteers/create',
			templateUrl: 'modules/volunteers/views/create-volunteer.client.view.html'
		}).
		state('viewVolunteer', {
			url: '/volunteers/:volunteerId',
			templateUrl: 'modules/volunteers/views/view-volunteer.client.view.html'
		}).
		state('editVolunteer', {
			url: '/volunteers/:volunteerId/edit',
			templateUrl: 'modules/volunteers/views/edit-volunteer.client.view.html'
		});
	}
]);