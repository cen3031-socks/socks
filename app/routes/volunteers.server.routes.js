'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var volunteers = require('../../app/controllers/volunteers.server.controller');
    var employees = require('../../app/controllers/employees.server.controller');

    var requireEmployee = employees.permissionLevel(users.EMPLOYEE);

	// Volunteers Routes
	app.route('/volunteers')
        .get(volunteers.list)
		.post(requireEmployee, volunteers.create);

	app.route('/allvolunteers')
        .get(volunteers.list)
		.post(requireEmployee);
		
    app.route('/volunteers/by-name/:contactId')
        .get(volunteers.getVolunteerByName);

    app.route('/volunteers/get-minutes/:contactId/:startDate/:endDate')
        .get(volunteers.minutesWorked);

	app.route('/volunteers/:volunteerId')
		.get(volunteers.read)
		.put(requireEmployee, volunteers.update)
		.delete(requireEmployee, volunteers.delete);

	// Finish by binding the Volunteer middleware
	app.param('volunteerId', volunteers.volunteerByID);

};
