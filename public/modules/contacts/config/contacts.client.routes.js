'use strict';

//Setting up route
angular.module('contacts', ['ui.router']).config(['$stateProvider',
	function($stateProvider) {
		// Contacts state routing
		$stateProvider.
		state('listContacts', {
			url: '/contacts',
			templateUrl: 'modules/contacts/views/list-contacts.client.view.html'
		}).
		state('createContact', {
			url: '/contacts/create',
			templateUrl: 'modules/contacts/views/create-contacts.client.view.html'
		}).
		state('viewContact', {
			url: '/contacts/:contactId',
			templateUrl: 'modules/contacts/views/view-contacts.client.view.html'
		}).
		state('editContact', {
			url: '/contacts/:contactId/edit',
			templateUrl: 'modules/contacts/views/edit-contacts.client.view.html'
		}).
            state('editNotModalContact', {
                url: '/contacts/:contactId/editNotModal',
                templateUrl: 'modules/contacts/views/edit-contacts-not-modal.client.view.html'
            }).
            state('deleteContact', {
                url: '/contacts/:contactId/edit/delete',
                templateUrl: 'modules/contacts/views/delete-confirm.client.view.html'
            }).
            state('adoptedCats', {
                url: '/contacts/:contactID/adoptedCats',
                templateUrl: 'modules/contacts/views/adopted-cats.client.view.html'
            });
	}
]);
