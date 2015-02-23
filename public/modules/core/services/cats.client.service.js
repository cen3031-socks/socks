'use strict';

angular.module('core').factory('Cats', ['$resource',
	function($resource) {
		return $resource('cats/:catId', {
			catId: '@_id'
		}, {
			update: {
				method: 'POST'
			}
		});
	}
]);
