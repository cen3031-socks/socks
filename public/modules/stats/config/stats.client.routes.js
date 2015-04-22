'use strict';

//Setting up route
angular.module('stats').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listStats', {
			url: '/stats',
			templateUrl: 'modules/stats/views/list-stats.client.view.html'
		}).
		state('catOriginMapStats', {
			url: '/stats/originMap',
			templateUrl: 'modules/stats/views/cat-origins-map.client.view.html'
		}).
		state('mapStats', {
			url: '/stats/map',
			templateUrl: 'modules/stats/views/stats-map.client.view.html'
		});
	}
]);
