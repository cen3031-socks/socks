'use strict';
//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('contacts/:contactId', { contactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            findAdoptedCats: {
                method: 'GET',
                url: 'contacts/:contactId/adoptions',
                isArray: true
            },
            getAllAdopters: {
                method: 'GET',
                url: 'adopters',
                isArray: true
            },
            findCatsWithVets: {
                method: 'GET',
                url: '/contacts/:contactId/vets',
                isArray: true
            },
            findDonations: {
                method: 'GET',
                url: 'contacts/:contactId/donations',
                isArray: true
            },
            addNote: {
                method: 'PUT',
                url: 'contacts/:contactId/notes'
            },
            deleteNote: {
                method: 'DELETE',
                url: 'contacts/:contactId/notes/:noteId'
            }
		});
	}
]);
