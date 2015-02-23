'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	cats = require('../../app/controllers/cats.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/cats')
		.get(cats.list)
		.post(cats.create);

	app.route('/cats/:catId').get(cats.view);
	/*.put(users.requiresLogin, cats.hasAuthorization, cats.update)*/
	/*.delete(users.requiresLogin, cats.hasAuthorization, cats.delete);*/

	// Finish by binding the cat middleware
	app.param('catId', cats.catByID);
};

