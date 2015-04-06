'use strict';

var users = require('../../app/controllers/users.server.controller');
var donations = require('../../app/controllers/donations.server.controller');

module.exports = function(app) {

	// Donations Routes
	app.route('/donations')
		.get(donations.list)
		.post(donations.create);

	app.route('/donations/:donationId')
		.get(donations.read)
		.put(donations.update)
		.delete(donations.delete);

	app.route('/donations/:donationId/items')
		.post(donations.addItem);

	app.route('/donations/:donationId/items/:itemId')
		.delete(donations.deleteItem);

	// Finish by binding the Donation middleware
	app.param('donationId', donations.donationByID);
};
