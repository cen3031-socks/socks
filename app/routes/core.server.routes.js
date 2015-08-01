'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
	app.route('/volunteer-signin').get(core.volunteers);

	app.route('/activate').
		get(core.activate);

	app.route('/create-admin').
		post(core.createAdmin);
};
