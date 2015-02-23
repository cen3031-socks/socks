'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var creates = require('../../app/controllers/creates.server.controller');

	// Creates Routes
	app.route('/creates')
		.get(creates.list)
		.post(creates.create);

	app.route('/creates/:createId')
		.get(creates.read)
		.put(users.requiresLogin, creates.hasAuthorization, creates.update)
		.delete(users.requiresLogin, creates.hasAuthorization, creates.delete);

	// Finish by binding the Create middleware
	app.param('createId', creates.createByID);
};
