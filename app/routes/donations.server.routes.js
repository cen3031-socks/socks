'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var donations = require('../../app/controllers/donations.server.controller');

	// Donations Routes
	app.route('/donations')
		.get(donations.list)
		.post(donations.create);

	app.route('/donations/:donationId')
		.get(donations.read)
		.put(donations.update)
		.delete(donations.delete);

	// Finish by binding the Donation middleware
	app.param('donationId', donations.donationByID);
};
