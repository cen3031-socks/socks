'use strict';

//Donations service used to communicate Donations REST endpoints
angular.module('donations').factory('Donations', [
	'$resource',
	function($resource) {
		return $resource('donations/:donationId', {
			donationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
