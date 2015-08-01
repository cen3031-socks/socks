'use strict';

//Setting up route
angular.module('donations').config([
	'$stateProvider',
	function($stateProvider) {
		// Donations state routing
		$stateProvider.
			state('listDonations', {
			url: '/donations',
			templateUrl: 'modules/donations/views/list-donations.client.view.html'
		}).
			state('createDonation', {
			url: '/donations/create',
			templateUrl: 'modules/donations/views/create-donation.client.view.html'
		}).
			state('viewDonation', {
			url: '/donations/:donationId',
			templateUrl: 'modules/donations/views/view-donation.client.view.html'
		}).
			state('editDonation', {
			url: '/donations/:donationId/edit',
			templateUrl: 'modules/donations/views/edit-donation.client.view.html'
		});
	}
]);
