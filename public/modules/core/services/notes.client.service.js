'use strict';

angular.module('core').factory('Notes', ['$resource',
	function($resource) {
		return $resource('notes/:aboutId/:noteId', {
			noteId: '@_id'
		}, {
            create: {
                method: 'POST',
                url: 'notes/:aboutId'
            },
            deleteNote: {
                method: 'DELETE',
                url: 'notes/:aboutId/:noteId'
            },
            getAboutId: {
                method: 'GET',
                url: 'notes/:aboutId',
                isArray: true
            }
		});
	}
]);
