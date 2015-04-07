'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var volunteers = require('../../app/controllers/volunteers.server.controller');

	// Volunteers Routes
	app.route('/volunteers')
        .get(volunteers.list)
		.post(volunteers.create);


    app.route('/volunteers/by-name/:contactId')
        .get(volunteers.getVolunteerByName);

    app.route('/volunteers/get-minutes/:contactId/:startDate_:endDate')
        .get(volunteers.minutesWorked);

	app.route('/volunteers/:volunteerId')
		.get(volunteers.read)
		.put(volunteers.update)
		.delete(volunteers.delete);

	// Finish by binding the Volunteer middleware
	app.param('volunteerId', volunteers.volunteerByID);

};
