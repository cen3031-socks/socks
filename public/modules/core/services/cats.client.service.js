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
				url: 'cats/:catId/events/:eventId'
			},
			deleteEvent: { 
				method: 'DELETE',
				url: 'cats/:catId/events/:eventId'
			},
			adopt: {
				method: 'POST',
				url: 'cats/:catId/adoptions'
			},
			unadopt: {
				method: 'PUT',
				url: 'cats/:catId/adoptions/:adoptionId'
			},
            addNote: {
                method: 'PUT',
                url: 'cats/:catId/notes'
            },
            deleteNote: {
                method: 'DELETE',
                url: 'cats/:catId/notes/:noteId'
            }
		});
	}
]);
