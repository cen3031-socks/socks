'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var volunteers = require('../../app/controllers/volunteers.server.controller');

	// Volunteers Routes
	app.route('/volunteers')		.get(volunteers.list)
		.post(users.requiresLogin, volunteers.create);

	app.route('/volunteers/:volunteerId')
		.get(volunteers.read)
		.put(users.requiresLogin, volunteers.hasAuthorization, volunteers.update)
		.delete(users.requiresLogin, volunteers.hasAuthorization, volunteers.delete);

	// Finish by binding the Volunteer middleware
	app.param('volunteerId', volunteers.volunteerByID);
};
