'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var employees = require('../../app/controllers/employees.server.controller');
    var reports = require('../../app/controllers/reports.server.controller');

	app.route('/reports')
        .get(employees.permissionLevel(users.EMPLOYEE), reports.list)
        .post(employees.permissionLevel(users.EMPLOYEE), reports.create);

    app.route('/reports/result-of')
        .post(employees.permissionLevel(users.EMPLOYEE), reports.temporary, reports.getResult);

    app.route('/reports/:reportId')
        .get(employees.permissionLevel(users.EMPLOYEE), reports.get)
        .put(employees.permissionLevel(users.EMPLOYEE), reports.update);

    app.route('/reports/:reportId/result')
        .get(employees.permissionLevel(users.EMPLOYEE), reports.getResult);

    //app.route('/reports/:reportId/result.csv')
    //    .get(employees.permissionLevel(users.EMPLOYEE), reports.getResultCsv);

    app.param('reportId', reports.reportById);
};
