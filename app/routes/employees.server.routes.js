'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employees = require('../../app/controllers/employees.server.controller');

	app.route('/employees').post(employees.permissionLevel(users.EMPLOYEES), employees.create);
};
