'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
		$stateProvider.state('newCat', {
			url: '/cats/new',
			templateUrl: 'modules/core/views/create-cat.client.view.html'
		});
        $stateProvider.state('viewCat', {
            url: '/cats/:catId',
            templateUrl: 'modules/core/views/view-cat.client.view.html'
        });
	}
]);

