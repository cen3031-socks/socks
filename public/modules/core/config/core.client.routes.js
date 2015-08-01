'use strict';

// Setting up route
angular.module('core').config([
	'$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
			state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
			state('create', {
			url: '/create',
			templateUrl: 'modules/core/views/create.client.view.html'
		}).
			state('addemployee', {
			url: '/addemployee',
			templateUrl: 'modules/core/views/addemployee.client.view.html'
		}).
			state('createCat', {
			url: '/cats/create',
			templateUrl: 'modules/cats/views/create-cat.client.view.html'
		}).
			state('viewCat', {
			url: '/cats/:catId',
			templateUrl: 'modules/cats/views/view-cat.client.view.html'
		}).
			state('editCat', {
			url:'/cats/:catId/edit',
			templateUrl: 'modules/cats/views/cat-edit.client.view.html'
		}).
			state('catVideos', {
			url: '/videos/:videoId',
			templateUrl: 'modules/cats/views/cat-videos.client.view.html'
		});

	}
]);
