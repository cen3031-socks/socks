'use strict';

var users = require('../../app/controllers/users.server.controller');
var donations = require('../../app/controllers/donations.server.controller');
var employees = require('../../app/controllers/employees.server.controller');

module.exports = function(app) {

    var requireEmployee = employees.permissionLevel(users.EMPLOYEE);

	// Donations Routes
	app.route('/donations')
		.get(requireEmployee, donations.list)
		.post(requireEmployee, donations.create);

	app.route('/donations/:donationId')
		.get(donations.read)
		.put(requireEmployee, donations.update)
		.delete(requireEmployee, donations.delete);

	app.route('/donations/:donationId/items')
		.post(requireEmployee, donations.addItem);

	app.route('/donations/:donationId/items/:itemId')
		.delete(requireEmployee, donations.deleteItem);

	// Finish by binding the Donation middleware
	app.param('donationId', donations.donationByID);
};
