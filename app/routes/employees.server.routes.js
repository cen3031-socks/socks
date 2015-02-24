'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employees = require('../../app/controllers/employees.server.controller');

	// Creates Routes
	app.route('/employees')
		.get(employees.list)
		.post(employees.create);

	app.route('/employees/:employeeId')
		.get(employees.read)
		.put(employees.hasAuthorization, employees.update)
		.delete(users.requiresLogin, employees.hasAuthorization, employees.delete);

	// Finish by binding the Create middleware
	app.param('employeeId', employees.employeeByID);
};
