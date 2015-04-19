'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employees = require('../../app/controllers/employees.server.controller');
    var reports = require('../../app/controllers/reports.server.controller');

	app.route('/reports')
        .get(employees.permissionLevel(users.EMPLOYEE), reports.list)
        .post(employees.permissionLevel(users.ADMIN), reports.create);

    app.route('/reports/:reportId')
        .get(employees.permissionLevel(users.EMPLOYEE), reports.getResult)
        .put(employees.permissionLevel(users.EMPLOYEE), reports.update);

    app.param('reportId', reports.reportById);
};
