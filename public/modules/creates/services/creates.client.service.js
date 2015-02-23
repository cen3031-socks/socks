'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('creates').factory('Creates', ['$resource',
	function($resource) {
		return $resource('creates/:createId', { createId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);