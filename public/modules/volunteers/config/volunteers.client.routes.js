'use strict';

//Setting up route
angular.module('volunteers').config(['$stateProvider',
	function($stateProvider) {
		// Volunteers state routing
		$stateProvider.
		state('listVolunteersForEmployee', {
			url: '/allvolunteers',
			templateUrl: 'modules/volunteers/views/all-volunteers.client.view.html'
		});
	}
]);
