'use strict';

//Setting up route
angular.module('creates').config(['$stateProvider',
	function($stateProvider) {
		// Creates state routing
		$stateProvider.
		state('listCreates', {
			url: '/creates',
			templateUrl: 'modules/creates/views/list-creates.client.view.html'
		}).
		state('createCreate', {
			url: '/creates/create',
			templateUrl: 'modules/creates/views/create-create.client.view.html'
		}).
		state('viewCreate', {
			url: '/creates/:createId',
			templateUrl: 'modules/creates/views/view-create.client.view.html'
		}).
		state('editCreate', {
			url: '/creates/:createId/edit',
			templateUrl: 'modules/creates/views/edit-create.client.view.html'
		});
	}
]);