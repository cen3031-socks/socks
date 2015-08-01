'use strict';

//Setting up route
angular.module('reports', ['ui.router']).config([
	'$stateProvider',
	function($stateProvider) {
		// Contacts state routing
		$stateProvider.state('exportIndex', {
			url: '/export',
			templateUrl: 'modules/reports/views/export-index.client.view.html'
		});
		$stateProvider.state('catSearch', {
			url: '/search/cats',
			templateUrl: 'modules/reports/views/cat-search.client.view.html'
		});
		$stateProvider.state('savedCatSearch', {
			url: '/search/cats/:reportId',
			templateUrl: 'modules/reports/views/cat-search.client.view.html'
		});
	}
]);
