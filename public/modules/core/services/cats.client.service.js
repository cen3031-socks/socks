'use strict';

angular.module('core').factory('Cats', ['$resource',
	function($resource) {
		return $resource('cats/:catId', {
			catId: '@_id'
		}, {
			update: {
				method: 'POST'
			},
			addEvent: { 
				method: 'POST',
				url: 'cats/:catId/events'
			},
			editEvent: {
				method: 'PUT',
				url: 'cats/:catId/events/:eventIndex'
			},
			deleteEvent: { 
				method: 'DELETE',
				url: 'cats/:catId/events/:eventIndex'
			}
		});
	}
]);
